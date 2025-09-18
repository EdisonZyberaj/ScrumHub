import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	DndContext,
	DragOverlay,
	closestCorners,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	Plus,
	MoreHorizontal,
	Calendar,
	AlertCircle,
	CheckCircle,
	Clock,
	User,
	Tag,
	Bug,
	Play,
	Target,
	TestTube,
	LayoutDashboard
} from "lucide-react";
import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";
import TaskDetailModal from "../../components/scrummaster/TaskAssignment/TaskDetailModal";
import CreateTaskModal from "../../components/scrummaster/TaskAssignment/CreateTaskModal";
const getPriorityColor = priority => {
    switch (priority.toLowerCase()) {
        case "critical":
            return "bg-red-100 text-red-800";
        case "high":
            return "bg-orange-100 text-orange-800";
        case "medium":
            return "bg-blue-100 text-blue-800";
        case "low":
            return "bg-green-100 text-green-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const getTagColor = tag => {
    switch (tag.toLowerCase()) {
        case "frontend":
            return "bg-purple-100 text-purple-800";
        case "backend":
            return "bg-indigo-100 text-indigo-800";
        case "design":
            return "bg-pink-100 text-pink-800";
        case "bug":
            return "bg-red-100 text-red-800";
        case "security":
            return "bg-yellow-100 text-yellow-800";
        case "performance":
            return "bg-green-100 text-green-800";
        case "documentation":
            return "bg-blue-100 text-blue-800";
        case "devops":
            return "bg-gray-100 text-gray-800";
        case "payment":
            return "bg-emerald-100 text-emerald-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const getInitials = name => {
    if (!name) return "?";
    return name.split(" ").map(part => part[0]).join("").toUpperCase();
};

const formatDate = dateString => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
};

const calculateDaysLeft = dueDate => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

const SortableTaskItem = ({ task, onTaskClick, ...props }) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id: task.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="bg-white rounded-lg shadow-sm p-4 mb-3 relative">
			{/* Drag handle - top portion */}
			<div 
				{...attributes}
				{...listeners}
				className="cursor-grab active:cursor-grabbing absolute top-0 right-0 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-bl-lg flex items-center justify-center opacity-50 hover:opacity-100"
			>
				<div className="w-3 h-3 bg-gray-400 rounded-full"></div>
			</div>
			
			{/* Click handler for task details - main content area */}
			<div 
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					console.log('Task clicked:', task.title);
					onTaskClick(task);
				}}
				className="cursor-pointer hover:shadow-md transition-shadow pr-10"
			>
			<div className="flex justify-between items-start mb-3">
				<h4 className="font-medium text-gray-800">
					{task.title}
				</h4>
			</div>

			<p className="text-gray-600 text-sm mb-3 line-clamp-2">
				{task.description}
			</p>

			<div className="flex flex-wrap gap-1 mb-3">
				{task.tags.map(tag =>
					<span
						key={tag}
						className={`text-xs px-2 py-1 rounded-full ${getTagColor(
							tag
						)}`}>
						{tag}
					</span>
				)}
			</div>

			<div className="flex items-center justify-between mb-2">
				<span
					className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
						task.priority
					)}`}>
					{task.priority}
				</span>
				<div className="flex items-center">
					<Clock className="h-3 w-3 text-gray-400 mr-1" />
					<span className="text-xs text-gray-500">
						{formatDate(task.dueDate)}
					</span>
				</div>
			</div>

			<div className="flex justify-between items-center pt-2 border-t border-gray-100">
				{task.assignee
					? <div className="flex items-center">
							<div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2">
								{getInitials(task.assignee.name)}
							</div>
							<span className="text-xs text-gray-600">
								{task.assignee.name.split(" ")[0]}
							</span>
						</div>
					: <div className="flex items-center text-gray-400">
							<User className="h-4 w-4 mr-1" />
							<span className="text-xs">
								Unassigned
							</span>
						</div>}

				<div
					className={`text-xs ${calculateDaysLeft(
						task.dueDate
					) <= 2
						? "text-red-500"
						: "text-gray-500"}`}>
					{calculateDaysLeft(task.dueDate) <= 0
						? "Overdue"
						: `${calculateDaysLeft(task.dueDate)}d`}
				</div>
			</div>
			</div> {/* Close click handler div */}
		</div>
	);
};

const Column = ({ column, tasks, onAddTask, onTaskClick }) => {
	return (
		<div className="bg-gray-100 rounded-lg shadow-sm pt-4">
			<div className="px-4 pb-3 flex justify-between items-center">
				<h3 className="font-bold text-gray-700">
					{column.title}
				</h3>
				<span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
					{column.taskIds.length}
				</span>
			</div>

			<div className="min-h-[70vh] p-4">
				<SortableContext
					items={tasks.map(task => task.id)}
					strategy={verticalListSortingStrategy}
				>
					{tasks.map((task) => (
						<SortableTaskItem key={task.id} task={task} onTaskClick={onTaskClick} />
					))}
				</SortableContext>

				<button 
					onClick={() => onAddTask(column.id)}
					className="w-full py-2 bg-white border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-primary hover:border-primary text-sm flex items-center justify-center transition-colors"
				>
					<Plus className="h-4 w-4 mr-1" />
					Add Task
				</button>
			</div>
		</div>
	);
};

function ScrumMasterBoard() {
	const navigate = useNavigate();
	const { id: projectId } = useParams();
	const [columns, setColumns] = useState({});
	const [activeSprint, setActiveSprint] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedTask, setSelectedTask] = useState(null);
	const [showTaskModal, setShowTaskModal] = useState(false);
	const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
	const [preSelectedStatus, setPreSelectedStatus] = useState(null);
	const [teamMembers, setTeamMembers] = useState([]);
	const [boardType, setBoardType] = useState('scrum');
	const [projects, setProjects] = useState([]);
	const [sprints, setSprints] = useState([]);

	useEffect(() => {
		const fetchSprintData = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				setError("Not authenticated");
				setIsLoading(false);
				return;
			}

			try {
				console.log('🔍 [DEBUG] Fetching data for project ID:', projectId);
				
				const projectResponse = await fetch(`http:
					headers: { 'Authorization': `Bearer ${token}` }
				});
				
				let projectData = null;
				if (projectResponse.ok) {
					projectData = await projectResponse.json();
					console.log('📋 [DEBUG] Project data:', projectData);
					setProjects([projectData]);
				} else {
					console.error('❌ [ERROR] Failed to fetch project data:', projectResponse.status);
				}

				const membersResponse = await fetch(`http:
					headers: { 'Authorization': `Bearer ${token}` }
				});
				
				let teamMembersData = [];
				if (membersResponse.ok) {
					teamMembersData = await membersResponse.json();
					teamMembersData = teamMembersData.map(member => ({
						id: member.id,
						name: member.fullName,
						email: member.email,
						role: member.role
					}));
				}

				let sprintData = null;
				const sprintsResponse = await fetch(`http:
					headers: { 'Authorization': `Bearer ${token}` }
				});
				
				if (sprintsResponse.ok) {
					const sprintsData = await sprintsResponse.json();
					console.log('🏃 [DEBUG] Sprints data:', sprintsData);
					setSprints(sprintsData);
					sprintData = sprintsData.find(sprint => sprint.status === 'ACTIVE') || sprintsData[0];
					console.log('🎯 [DEBUG] Selected sprint:', sprintData);
					if (sprintData) {
						const tasksResponse = await fetch(`http:
							headers: { 'Authorization': `Bearer ${token}` }
						});
						
						if (tasksResponse.ok) {
							const tasks = await tasksResponse.json();
							console.log('📝 [DEBUG] Sprint tasks for progress:', tasks);
							const completedTasks = tasks.filter(task => task.status === 'DONE').length;
							sprintData.progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
						}
					}
				} else {
					console.error('❌ [ERROR] Failed to fetch sprints:', sprintsResponse.status);
				}

				console.log('🔍 [DEBUG] Checking if tasks exist for project...');
				try {
					const directTasksResponse = await fetch(`http:
						headers: { 'Authorization': `Bearer ${token}` }
					});
					if (directTasksResponse.ok) {
						const directTasks = await directTasksResponse.json();
						console.log('📝 [DEBUG] Direct project tasks found:', directTasks.length);
						console.log('📝 [DEBUG] Sample tasks:', directTasks.slice(0, 3));
					} else {
						console.error('❌ [ERROR] Failed to fetch direct tasks:', directTasksResponse.status);
					}
				} catch (e) {
					console.error('❌ [ERROR] Error fetching direct tasks:', e);
				}

				let boardData = { scrum: null, testing: null };
				
				try {
					let boardResponse;
					let apiUrl;
					if (sprintData) {
						apiUrl = `http:
						console.log('🌐 [DEBUG] Using sprint-based API:', apiUrl);
						boardResponse = await fetch(apiUrl, {
							headers: { 'Authorization': `Bearer ${token}` }
						});
					} else {
						apiUrl = `http:
						console.log('🌐 [DEBUG] Using project-based API:', apiUrl);
						boardResponse = await fetch(apiUrl, {
							headers: { 'Authorization': `Bearer ${token}` }
						});
					}
					
					if (boardResponse.ok) {
						const apiData = await boardResponse.json();
						console.log('📊 [DEBUG] Raw API Response:', apiData);
						console.log('📊 [DEBUG] API Response keys:', Object.keys(apiData));
						console.log('📊 [DEBUG] API Response JSON:', JSON.stringify(apiData, null, 2));
						
						let tasksByStatus;
						if (apiData.tasksByStatus) {
							console.log('📁 [DEBUG] Using tasksByStatus from scrum master format');
							tasksByStatus = apiData.tasksByStatus;
							console.log('📁 [DEBUG] tasksByStatus content:', JSON.stringify(tasksByStatus, null, 2));
						} else {
							console.log('📁 [DEBUG] Using direct format from project endpoint');
							tasksByStatus = apiData;
						}
						
						console.log('📋 [DEBUG] Extracted tasksByStatus:', tasksByStatus);
						
						tasksByStatus = {
							TO_DO: [],
							IN_PROGRESS: [],
							READY_FOR_TESTING: [],
							IN_TESTING: [],
							BUG_FOUND: [],
							TEST_PASSED: [],
							DONE: [],
							...tasksByStatus
						};
						
						console.log('✅ [DEBUG] Final tasksByStatus with defaults:', tasksByStatus);
						
						const processedTasks = {};
						let taskCounter = 1;
						
						const processTasksForColumn = (tasks) => {
							console.log('🔄 [DEBUG] Processing tasks for column:', tasks);
							if (!tasks || !Array.isArray(tasks)) {
								console.log('⚠️ [DEBUG] Tasks is not an array or is null:', tasks);
								return [];
							}
							
							const taskIds = tasks.map(task => {
								const taskId = `task-${taskCounter++}`;
								console.log('📝 [DEBUG] Processing task:', task.title, 'with ID:', taskId);
								processedTasks[taskId] = {
									id: taskId,
									originalId: task.id,
									title: task.title,
									description: task.description,
									priority: task.priority,
									dueDate: task.dueDate,
									assignee: task.assignee ? {
										id: task.assignee.id,
										name: task.assignee.fullName,
										avatar: null
									} : null,
									tags: task.tags || []
								};
								return taskId;
							});
							
							console.log('✅ [DEBUG] Generated task IDs for column:', taskIds);
							return taskIds;
						};
						
						boardData = {
							scrum: {
								columnOrder: ["todo", "inProgress", "review", "done"],
								columns: {
									todo: {
										id: "todo",
										title: "To Do",
										taskIds: processTasksForColumn(tasksByStatus.TO_DO || [])
									},
									inProgress: {
										id: "inProgress", 
										title: "In Progress",
										taskIds: processTasksForColumn(tasksByStatus.IN_PROGRESS || [])
									},
									review: {
										id: "review",
										title: "In Review", 
										taskIds: processTasksForColumn(tasksByStatus.READY_FOR_TESTING || [])
									},
									done: {
										id: "done",
										title: "Done",
										taskIds: processTasksForColumn(tasksByStatus.DONE || [])
									}
								},
								tasks: processedTasks
							},
							testing: {
								columnOrder: ["readyForTesting", "inTesting", "bugFound", "testPassed"],
								columns: {
									readyForTesting: {
										id: "readyForTesting",
										title: "Ready for Testing",
										taskIds: processTasksForColumn(tasksByStatus.READY_FOR_TESTING || [])
									},
									inTesting: {
										id: "inTesting", 
										title: "In Testing",
										taskIds: processTasksForColumn(tasksByStatus.IN_TESTING || [])
									},
									bugFound: {
										id: "bugFound",
										title: "Bug Found",
										taskIds: processTasksForColumn(tasksByStatus.BUG_FOUND || [])
									},
									testPassed: {
										id: "testPassed",
										title: "Test Passed",
										taskIds: processTasksForColumn(tasksByStatus.TEST_PASSED || [])
									}
								},
								tasks: processedTasks
							}
						};
						
						console.log('🎯 [DEBUG] Final processed board data:', boardData);
						console.log('📊 [DEBUG] Total processed tasks:', Object.keys(boardData.scrum.tasks).length);
						
						Object.keys(boardData.scrum.columns).forEach(columnId => {
							const column = boardData.scrum.columns[columnId];
							console.log(`📋 [DEBUG] Column ${columnId}:`, {
								title: column.title,
								taskCount: column.taskIds.length,
								taskIds: column.taskIds
							});
						});
					} else {
						console.error('Failed to fetch board data:', boardResponse.status, boardResponse.statusText);
						try {
							const errorText = await boardResponse.text();
							console.error('Board API error details:', errorText);
						} catch (e) {
							console.error('Could not read error response');
						}
						
						if (boardResponse.status === 403 && sprintData) {
							console.warn('Scrum master endpoint forbidden, trying project-based endpoint');
							try {
								const fallbackResponse = await fetch(`http:
									headers: { 'Authorization': `Bearer ${token}` }
								});
								if (fallbackResponse.ok) {
									const fallbackData = await fallbackResponse.json();
									console.log('Fallback API Response:', fallbackData);
									
									const tasksByStatus = {
										TO_DO: [],
										IN_PROGRESS: [],
										READY_FOR_TESTING: [],
										IN_TESTING: [],
										BUG_FOUND: [],
										TEST_PASSED: [],
										DONE: [],
										...fallbackData
									};
									
									const processedTasks = {};
									let taskCounter = 1;
									
									const processTasksForColumn = (tasks) => {
										if (!tasks || !Array.isArray(tasks)) return [];
										
										return tasks.map(task => {
											const taskId = `task-${taskCounter++}`;
											processedTasks[taskId] = {
												id: taskId,
												originalId: task.id,
												title: task.title,
												description: task.description,
												priority: task.priority,
												dueDate: task.dueDate,
												assignee: task.assignee ? {
													id: task.assignee.id,
													name: task.assignee.fullName,
													avatar: null
												} : null,
												tags: task.tags || []
											};
											return taskId;
										});
									};
									
									boardData = {
										scrum: {
											columnOrder: ["todo", "inProgress", "review", "done"],
											columns: {
												todo: {
													id: "todo",
													title: "To Do",
													taskIds: processTasksForColumn(tasksByStatus.TO_DO || [])
												},
												inProgress: {
													id: "inProgress", 
													title: "In Progress",
													taskIds: processTasksForColumn(tasksByStatus.IN_PROGRESS || [])
												},
												review: {
													id: "review",
													title: "In Review", 
													taskIds: processTasksForColumn(tasksByStatus.READY_FOR_TESTING || [])
												},
												done: {
													id: "done",
													title: "Done",
													taskIds: processTasksForColumn(tasksByStatus.DONE || [])
												}
											},
											tasks: processedTasks
										},
										testing: {
											columnOrder: ["readyForTesting", "inTesting", "bugFound", "testPassed"],
											columns: {
												readyForTesting: {
													id: "readyForTesting",
													title: "Ready for Testing",
													taskIds: processTasksForColumn(tasksByStatus.READY_FOR_TESTING || [])
												},
												inTesting: {
													id: "inTesting", 
													title: "In Testing",
													taskIds: processTasksForColumn(tasksByStatus.IN_TESTING || [])
												},
												bugFound: {
													id: "bugFound",
													title: "Bug Found",
													taskIds: processTasksForColumn(tasksByStatus.BUG_FOUND || [])
												},
												testPassed: {
													id: "testPassed",
													title: "Test Passed",
													taskIds: processTasksForColumn(tasksByStatus.TEST_PASSED || [])
												}
											},
											tasks: processedTasks
										}
									};
									
									console.log('Fallback board data processed successfully');
								}
							} catch (fallbackError) {
								console.error('Fallback API also failed:', fallbackError);
							}
						}
					}
				} catch (error) {
					console.error('Error fetching board data:', error);
				}

				setActiveSprint(sprintData);
				setTeamMembers(teamMembersData);
				
				const defaultBoardData = {
					scrum: {
						columnOrder: ["todo", "inProgress", "review", "done"],
						columns: {
							todo: { id: "todo", title: "To Do", taskIds: [] },
							inProgress: { id: "inProgress", title: "In Progress", taskIds: [] },
							review: { id: "review", title: "In Review", taskIds: [] },
							done: { id: "done", title: "Done", taskIds: [] }
						},
						tasks: {}
					},
					testing: {
						columnOrder: ["readyForTesting", "inTesting", "bugFound", "testPassed"],
						columns: {
							readyForTesting: { id: "readyForTesting", title: "Ready for Testing", taskIds: [] },
							inTesting: { id: "inTesting", title: "In Testing", taskIds: [] },
							bugFound: { id: "bugFound", title: "Bug Found", taskIds: [] },
							testPassed: { id: "testPassed", title: "Test Passed", taskIds: [] }
						},
						tasks: {}
					}
				};
				
				if (!boardData.scrum) {
					boardData = defaultBoardData;
				}
				
				console.log('🔧 [DEBUG] Setting columns state with:', {
					scrum: boardData.scrum,
					testing: boardData.testing
				});
				
				setColumns({
					scrum: boardData.scrum,
					testing: boardData.testing,
					current: boardData.scrum
				});
				
				console.log('✅ [DEBUG] Columns state has been set');

				setIsLoading(false);
			} catch (err) {
				console.error("Error fetching sprint data:", err);
				setError("Failed to load sprint board data");
				setIsLoading(false);
			}
		};

		fetchSprintData();
	}, [projectId]);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor)
	);

	const handleDragEnd = (event) => {
		const { active, over } = event;

		if (!over) return;

		const activeTask = active.id;
		const overTask = over.id;

		if (activeTask === overTask) return;

		setColumns((prevColumns) => {
			const currentBoard = prevColumns[boardType];
			if (!currentBoard || !currentBoard.columns) return prevColumns;
			
			const oldColumnId = Object.keys(currentBoard.columns).find(columnId =>
				currentBoard.columns[columnId].taskIds.includes(activeTask)
			);
			
			const newColumnId = Object.keys(currentBoard.columns).find(columnId =>
				currentBoard.columns[columnId].taskIds.includes(overTask)
			);

			if (oldColumnId === newColumnId) {
				const newTaskIds = [...currentBoard.columns[oldColumnId].taskIds];
				const oldIndex = newTaskIds.indexOf(activeTask);
				const newIndex = newTaskIds.indexOf(overTask);

				const reorderedTaskIds = arrayMove(newTaskIds, oldIndex, newIndex);

				const updatedBoard = {
					...currentBoard,
					columns: {
						...currentBoard.columns,
						[oldColumnId]: {
							...currentBoard.columns[oldColumnId],
							taskIds: reorderedTaskIds,
						},
					},
				};

				return {
					...prevColumns,
					[boardType]: updatedBoard
				};
			}

			const sourceTaskIds = [...currentBoard.columns[oldColumnId].taskIds];
			const destinationTaskIds = [...currentBoard.columns[newColumnId].taskIds];

			const sourceIndex = sourceTaskIds.indexOf(activeTask);
			const destinationIndex = destinationTaskIds.indexOf(overTask);

			sourceTaskIds.splice(sourceIndex, 1);
			destinationTaskIds.splice(destinationIndex, 0, activeTask);

			const updatedBoard = {
				...currentBoard,
				columns: {
					...currentBoard.columns,
					[oldColumnId]: {
						...currentBoard.columns[oldColumnId],
						taskIds: sourceTaskIds,
					},
					[newColumnId]: {
						...currentBoard.columns[newColumnId],
						taskIds: destinationTaskIds,
					},
				},
			};

			return {
				...prevColumns,
				[boardType]: updatedBoard
			};
		});
	};

	const handleAddTask = (columnId) => {
		const statusMap = {
			'todo': 'TO_DO',
			'inProgress': 'IN_PROGRESS',
			'review': 'READY_FOR_TESTING',
			'done': 'DONE',
			'readyForTesting': 'READY_FOR_TESTING',
			'inTesting': 'IN_TESTING',
			'bugFound': 'BUG_FOUND',
			'testPassed': 'TEST_PASSED'
		};
		
		const targetStatus = statusMap[columnId] || 'TO_DO';
		setPreSelectedStatus(targetStatus);
		setShowCreateTaskModal(true);
	};

	const handleTaskClick = (task) => {
		console.log('handleTaskClick called with:', task);
		if (!task || !task.title) {
			console.error('Invalid task data received:', task);
			return;
		}
		
		const formattedTask = {
			...task,
			status: getTaskStatus(task),
			assignedTo: task.assignee?.id || null,
			estimatedHours: task.estimatedHours || 8,
			createdAt: task.createdAt || new Date().toISOString().split('T')[0],
			updatedAt: task.updatedAt || new Date().toISOString().split('T')[0]
		};
		console.log('Setting selected task:', formattedTask);
		setSelectedTask(formattedTask);
		setShowTaskModal(true);
	};

	const getTaskStatus = (task) => {
		const currentBoard = columns[boardType] || columns.scrum;
		
		for (const columnId of currentBoard.columnOrder || []) {
			const column = currentBoard.columns?.[columnId];
			if (column?.taskIds.includes(task.id)) {
				const statusMap = {
					'todo': 'TO_DO',
					'inProgress': 'IN_PROGRESS',
					'review': 'READY_FOR_TESTING',
					'done': 'DONE',
					'readyForTesting': 'READY_FOR_TESTING',
					'inTesting': 'IN_TESTING',
					'bugFound': 'BUG_FOUND',
					'testPassed': 'TEST_PASSED'
				};
				return statusMap[columnId] || 'TO_DO';
			}
		}
		return 'TO_DO';
	};

	const handleBoardTypeSwitch = (newBoardType) => {
		console.log('Switching to board type:', newBoardType);
		setBoardType(newBoardType);
		setColumns(prev => {
			const newCurrent = prev[newBoardType] || prev.scrum || {};
			console.log('Setting current board to:', newCurrent);
			return {
				...prev,
				current: newCurrent
			};
		});
	};

	const handleCreateTask = async (taskData) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('No authentication token found');
			}

			const taskPayload = {
				title: taskData.title,
				description: taskData.description,
				acceptanceCriteria: taskData.acceptanceCriteria || 'Task should be completed according to requirements',
				projectId: parseInt(projectId),
				sprintId: activeSprint?.id || null,
				type: 'USER_STORY',
				priority: taskData.priority || 'MEDIUM',
				status: preSelectedStatus || 'TO_DO',
				estimatedHours: taskData.estimatedHours || null,
				dueDate: taskData.dueDate ? taskData.dueDate + 'T23:59:59' : null,
				assigneeId: null
			};

			console.log('Creating task with payload:', taskPayload);

			const response = await fetch('http:
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(taskPayload)
			});

			if (!response.ok) {
				let errorMessage = 'Failed to create task';
				try {
					const errorData = await response.json();
					errorMessage = errorData.message || errorData.error || errorMessage;
				} catch (e) {
					errorMessage = `HTTP ${response.status}: ${response.statusText}`;
				}
				console.error('Task creation failed:', errorMessage);
				throw new Error(errorMessage);
			}

			const newTask = await response.json();
			console.log('Task created successfully:', newTask);
			
			window.location.reload();
			
		} catch (error) {
			console.error('Error creating task:', error);
			throw error;
		}
	};

	const handleReassignTask = async (taskId, newAssigneeId) => {
		try {
			console.log(`Reassigning task ${taskId} to user ${newAssigneeId}`);

			setColumns(prevColumns => {
				const updatedTasks = { ...prevColumns[boardType].tasks };
				if (updatedTasks[taskId]) {
					const assignedUser = teamMembers.find(member => member.id === parseInt(newAssigneeId));
					updatedTasks[taskId] = {
						...updatedTasks[taskId],
						assignee: assignedUser || null
					};
				}
				return {
					...prevColumns,
					[boardType]: {
						...prevColumns[boardType],
						tasks: updatedTasks
					}
				};
			});

			if (selectedTask && selectedTask.id === taskId) {
				const assignedUser = teamMembers.find(member => member.id === parseInt(newAssigneeId));
				setSelectedTask(prev => ({
					...prev,
					assignedTo: parseInt(newAssigneeId),
					assignee: assignedUser || null
				}));
			}
		} catch (error) {
			console.error('Error reassigning task:', error);
			throw error;
		}
	};

	const handleStatusChange = async (taskOriginalId, newStatus) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('No authentication token found');
			}

			console.log(`Updating task ${taskOriginalId} status to ${newStatus}`);

			const response = await fetch(`http:
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status: newStatus })
			});

			if (!response.ok) {
				let errorMessage = 'Failed to update task status';
				try {
					const errorData = await response.json();
					errorMessage = errorData.message || errorMessage;
				} catch (e) {
					errorMessage = `HTTP ${response.status}: ${response.statusText}`;
				}
				console.error('Status update failed:', errorMessage);
				throw new Error(errorMessage);
			}

			const updatedTask = await response.json();
			console.log('Task status updated successfully:', updatedTask);

			window.location.reload();

		} catch (error) {
			console.error('Error updating task status:', error);
			throw error;
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-col min-h-screen">
				<Navbar />
				<div className="flex-grow flex items-center justify-center">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
				</div>
				<Footer />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col min-h-screen">
				<Navbar />
				<div className="flex-grow flex items-center justify-center">
					<div className="text-center">
						<AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-gray-800 mb-2">
							Error Loading Sprint Board
						</h2>
						<p className="text-gray-600">
							{error}
						</p>
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen bg-gray-50">
			<Navbar />

			<main className="flex-grow container mx-auto px-4 py-8">
				{activeSprint &&
					<div className="mb-8">
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
							<div>
								<h1 className="text-3xl font-bold text-gray-800">
									{activeSprint.name}
								</h1>
								<div className="flex items-center mt-2 text-gray-600">
									<Calendar className="h-4 w-4 mr-1" />
									<span>
										{formatDate(activeSprint.startDate)} -{" "}
										{formatDate(activeSprint.endDate)}
									</span>
								</div>
							</div>
							<button 
								onClick={() => {
									setPreSelectedStatus('TO_DO');
									setShowCreateTaskModal(true);
								}}
								className="mt-4 md:mt-0 bg-primary text-white px-4 py-2 rounded-md hover:bg-hoverBlue transition flex items-center"
							>
								<Plus className="h-4 w-4 mr-1" />
								Add Task
							</button>
						</div>

						<div className="bg-white p-4 rounded-lg shadow-sm mb-6">
							<div className="mb-3">
								<h3 className="font-medium text-gray-700">Sprint Goal</h3>
								<p className="text-gray-600">
									{activeSprint.goal}
								</p>
							</div>

							<div className="w-full bg-gray-200 rounded-full h-2 mb-1">
								<div
									className="bg-primary h-2 rounded-full"
									style={{ width: `${activeSprint.progress}%` }}
								/>
							</div>
							<div className="flex justify-between text-xs text-gray-500">
								<span>
									{activeSprint.progress}% completed
								</span>
								<span>
									{calculateDaysLeft(activeSprint.endDate)} days remaining
								</span>
							</div>
						</div>
					</div>}

				{/* Board Type Switcher */}
				<div className="bg-white rounded-lg shadow-sm p-4 mb-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-medium text-gray-800">Board View</h3>
						<div className="text-sm text-gray-600">
							Switch between different board perspectives for comprehensive project management
						</div>
					</div>
					
					<div className="flex gap-2">
						<button
							onClick={() => handleBoardTypeSwitch('scrum')}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								boardType === 'scrum'
									? 'bg-primary text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							<LayoutDashboard className="h-4 w-4" />
							Scrum Board
						</button>
						<button
							onClick={() => handleBoardTypeSwitch('testing')}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								boardType === 'testing'
									? 'bg-primary text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							<TestTube className="h-4 w-4" />
							Testing Board
						</button>
					</div>

					<div className="mt-3 p-3 bg-gray-50 rounded-lg">
						<p className="text-sm text-gray-600">
							{boardType === 'scrum' ? (
								<>
									<Target className="h-4 w-4 inline mr-1" />
									<strong>Scrum Board:</strong> Manage development tasks through the standard workflow - To Do, In Progress, In Review, and Done.
								</>
							) : (
								<>
									<Bug className="h-4 w-4 inline mr-1" />
									<strong>Testing Board:</strong> Track quality assurance tasks - Ready for Testing, In Testing, Bug Found, and Test Passed.
								</>
							)}
						</p>
					</div>
				</div>

				<DndContext
					sensors={sensors}
					collisionDetection={closestCorners}
					onDragEnd={handleDragEnd}
				>
					<div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 gap-6">
						{(() => {
							console.log('🎨 [DEBUG] Rendering board. boardType:', boardType);
							console.log('🎨 [DEBUG] Available columns keys:', Object.keys(columns));
							console.log('🎨 [DEBUG] Current board data:', columns[boardType]);
							
							return columns[boardType]?.columnOrder?.map(columnId => {
								console.log('🎨 [DEBUG] Rendering column:', columnId);
								const column = columns[boardType]?.columns?.[columnId];
								if (!column) {
									console.warn('❌ [WARN] Column not found:', columnId, 'in boardType:', boardType);
									return null;
								}
								
								console.log('🎨 [DEBUG] Column data:', column);
								const tasks = (column.taskIds || []).map(taskId => {
									const task = columns[boardType]?.tasks?.[taskId];
									if (!task) {
										console.warn('❌ [WARN] Task not found:', taskId);
										return null;
									}
									return task;
								}).filter(Boolean);

								console.log('🎨 [DEBUG] Column', columnId, 'has', tasks.length, 'tasks');

								return (
									<Column
										key={column.id}
										column={column}
										tasks={tasks}
										onAddTask={handleAddTask}
										onTaskClick={handleTaskClick}
									/>
								);
							}).filter(Boolean);
						})()}
					</div>
				</DndContext>
			</main>

			{/* Task Detail Modal */}
			<TaskDetailModal
				isOpen={showTaskModal}
				onClose={() => {
					console.log('Closing task modal');
					setShowTaskModal(false);
					setSelectedTask(null);
				}}
				task={selectedTask}
				onReassign={handleReassignTask}
				onStatusChange={handleStatusChange}
				teamMembers={teamMembers}
			/>

			{/* Create Task Modal */}
			<CreateTaskModal
				isOpen={showCreateTaskModal}
				onClose={() => {
					setShowCreateTaskModal(false);
					setPreSelectedStatus(null);
				}}
				onSubmit={handleCreateTask}
				projects={projects}
				sprints={sprints}
				selectedProject={projects[0]?.id || null}
				selectedSprint={activeSprint?.id || null}
				preSelectedStatus={preSelectedStatus}
			/>
			
			{/* Debug info */}
			{console.log('Modal state - showTaskModal:', showTaskModal, 'selectedTask:', selectedTask?.title)}

			<Footer />
		</div>
	);
}

export default ScrumMasterBoard;
