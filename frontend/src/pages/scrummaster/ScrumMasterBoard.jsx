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
					console.log('Task clicked:', task.title); // Debug log
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
	const [teamMembers, setTeamMembers] = useState([]);
	const [boardType, setBoardType] = useState('scrum'); // 'scrum' or 'testing'

	useEffect(() => {
		const fetchSprintData = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				setError("Not authenticated");
				setIsLoading(false);
				return;
			}

			try {
				// Mock team members data
				const mockTeamMembers = [
					{ id: 1, name: "John Smith", email: "john@example.com", role: "DEVELOPER" },
					{ id: 2, name: "Alex Wong", email: "alex@example.com", role: "DEVELOPER" },
					{ id: 3, name: "Emily Johnson", email: "emily@example.com", role: "DEVELOPER" },
					{ id: 4, name: "Michael Brown", email: "michael@example.com", role: "DEVELOPER" },
					{ id: 5, name: "Sarah Davis", email: "sarah@example.com", role: "TESTER" },
					{ id: 6, name: "David Wilson", email: "david@example.com", role: "DEVELOPER" }
				];

				const mockSprint = {
					id: 1,
					name: "Sprint 15",
					startDate: "2025-05-05",
					endDate: "2025-05-19",
					goal: "Complete the payment integration and user profile features",
					progress: 45
				};

				// Scrum Board Columns
				const mockScrumColumns = {
					todo: {
						id: "todo",
						title: "To Do",
						taskIds: ["task-1", "task-2", "task-3", "task-4"]
					},
					inProgress: {
						id: "inProgress",
						title: "In Progress",
						taskIds: ["task-5", "task-6", "task-7"]
					},
					review: {
						id: "review",
						title: "In Review",
						taskIds: ["task-8"]
					},
					done: {
						id: "done",
						title: "Done",
						taskIds: ["task-9", "task-10"]
					}
				};

				// Testing Board Columns
				const mockTestingColumns = {
					readyForTesting: {
						id: "readyForTesting",
						title: "Ready for Testing",
						taskIds: ["test-task-1", "test-task-2"]
					},
					inTesting: {
						id: "inTesting",
						title: "In Testing",
						taskIds: ["test-task-3", "test-task-4"]
					},
					bugFound: {
						id: "bugFound",
						title: "Bug Found",
						taskIds: ["test-task-5"]
					},
					testPassed: {
						id: "testPassed",
						title: "Test Passed",
						taskIds: ["test-task-6", "test-task-7"]
					}
				};

				const mockTasks = {
					"task-1": {
						id: "task-1",
						title: "User profile page design",
						description: "Create UI design for the user profile page",
						priority: "Medium",
						dueDate: "2025-05-17",
						assignee: {
							id: 3,
							name: "Emily Johnson",
							avatar: null
						},
						tags: ["Design", "Frontend"]
					},
					"task-2": {
						id: "task-2",
						title: "Implement password reset feature",
						description: "Add functionality for users to reset their passwords",
						priority: "High",
						dueDate: "2025-05-18",
						assignee: {
							id: 1,
							name: "John Smith",
							avatar: null
						},
						tags: ["Backend", "Security"]
					},
					"task-3": {
						id: "task-3",
						title: "Fix mobile responsive issues",
						description: "Address responsive design issues on small screens",
						priority: "Low",
						dueDate: "2025-05-15",
						assignee: {
							id: 2,
							name: "Alex Wong",
							avatar: null
						},
						tags: ["Frontend", "Bug"]
					},
					"task-4": {
						id: "task-4",
						title: "Create API documentation",
						description: "Document all API endpoints for integration",
						priority: "Medium",
						dueDate: "2025-05-19",
						assignee: null,
						tags: ["Documentation"]
					},
					"task-5": {
						id: "task-5",
						title: "Implement payment gateway integration",
						description: "Integrate Stripe payment processing",
						priority: "Critical",
						dueDate: "2025-05-16",
						assignee: {
							id: 4,
							name: "Michael Brown",
							avatar: null
						},
						tags: ["Backend", "Payment"]
					},
					"task-6": {
						id: "task-6",
						title: "Add user notification system",
						description: "Create a notification system for user activities",
						priority: "High",
						dueDate: "2025-05-17",
						assignee: {
							id: 5,
							name: "Sarah Davis",
							avatar: null
						},
						tags: ["Frontend", "Backend"]
					},
					"task-7": {
						id: "task-7",
						title: "Improve page load performance",
						description: "Optimize frontend to reduce load times",
						priority: "Medium",
						dueDate: "2025-05-18",
						assignee: {
						 id: 2,
						 name: "Alex Wong",
						 avatar: null
						},
						tags: ["Frontend", "Performance"]
					},
					"task-8": {
						id: "task-8",
						title: "User settings page",
						description: "Create a page for users to manage account settings",
						priority: "Medium",
						dueDate: "2025-05-16",
						assignee: {
							id: 3,
							name: "Emily Johnson",
							avatar: null
						},
						tags: ["Frontend"]
					},
					"task-9": {
						id: "task-9",
						title: "Login page redesign",
						description: "Update the login page with new branding",
						priority: "Medium",
						dueDate: "2025-05-12",
						assignee: {
							id: 3,
							name: "Emily Johnson",
							avatar: null
						},
						tags: ["Design", "Frontend"]
					},
					"task-10": {
						id: "task-10",
						title: "Setup CI/CD pipeline",
						description: "Implement continuous integration and deployment",
						priority: "High",
						dueDate: "2025-05-11",
						assignee: {
							id: 6,
							name: "David Wilson",
							avatar: null
						},
						tags: ["DevOps"]
					},
					// Testing Tasks
					"test-task-1": {
						id: "test-task-1",
						title: "Test user registration flow",
						description: "Verify that new users can register successfully with valid data",
						priority: "High",
						dueDate: "2025-05-16",
						assignee: {
							id: 5,
							name: "Sarah Davis",
							avatar: null
						},
						tags: ["Frontend", "Backend", "Testing"]
					},
					"test-task-2": {
						id: "test-task-2",
						title: "Test payment gateway integration",
						description: "Verify payment processing with different card types and scenarios",
						priority: "Critical",
						dueDate: "2025-05-17",
						assignee: {
							id: 5,
							name: "Sarah Davis",
							avatar: null
						},
						tags: ["Payment", "Testing", "Security"]
					},
					"test-task-3": {
						id: "test-task-3",
						title: "Mobile responsiveness testing",
						description: "Test UI components across different mobile devices and screen sizes",
						priority: "Medium",
						dueDate: "2025-05-18",
						assignee: {
							id: 5,
							name: "Sarah Davis",
							avatar: null
						},
						tags: ["Frontend", "Testing", "Mobile"]
					},
					"test-task-4": {
						id: "test-task-4",
						title: "API performance testing",
						description: "Load test all API endpoints for performance and reliability",
						priority: "High",
						dueDate: "2025-05-19",
						assignee: {
							id: 5,
							name: "Sarah Davis",
							avatar: null
						},
						tags: ["Backend", "Performance", "Testing"]
					},
					"test-task-5": {
						id: "test-task-5",
						title: "User profile validation bug",
						description: "Fix validation issues in user profile update functionality",
						priority: "High",
						dueDate: "2025-05-15",
						assignee: {
							id: 3,
							name: "Emily Johnson",
							avatar: null
						},
						tags: ["Bug", "Frontend", "Testing"]
					},
					"test-task-6": {
						id: "test-task-6",
						title: "Login security tests",
						description: "All security tests for login functionality passed successfully",
						priority: "Critical",
						dueDate: "2025-05-14",
						assignee: {
							id: 5,
							name: "Sarah Davis",
							avatar: null
						},
						tags: ["Security", "Testing", "Backend"]
					},
					"test-task-7": {
						id: "test-task-7",
						title: "Email notification tests",
						description: "All email notification scenarios tested and working correctly",
						priority: "Medium",
						dueDate: "2025-05-13",
						assignee: {
							id: 5,
							name: "Sarah Davis",
							avatar: null
						},
						tags: ["Backend", "Testing", "Email"]
					}
				};

				setActiveSprint(mockSprint);
				setTeamMembers(mockTeamMembers);
				
				// Set columns based on board type
				const scrumBoard = {
					columnOrder: ["todo", "inProgress", "review", "done"],
					columns: mockScrumColumns,
					tasks: mockTasks
				};
				
				const testingBoard = {
					columnOrder: ["readyForTesting", "inTesting", "bugFound", "testPassed"],
					columns: mockTestingColumns,
					tasks: mockTasks
				};
				
				// Store both board types
				setColumns({
					scrum: scrumBoard,
					testing: testingBoard,
					current: scrumBoard // Initialize with scrum board
				});

				setIsLoading(false);
			} catch (err) {
				console.error("Error fetching sprint data:", err);
				setError("Failed to load sprint board data");
				setIsLoading(false);
			}
		};

		fetchSprintData();
	}, []);

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
		// Navigate to task assignment page with pre-selected column status
		const statusMap = {
			// Scrum Board Status
			'todo': 'TO_DO',
			'inProgress': 'IN_PROGRESS',
			'review': 'READY_FOR_TESTING',
			'done': 'DONE',
			// Testing Board Status
			'readyForTesting': 'READY_FOR_TESTING',
			'inTesting': 'IN_TESTING',
			'bugFound': 'BUG_FOUND',
			'testPassed': 'TEST_PASSED'
		};
		
		const targetStatus = statusMap[columnId] || 'TO_DO';
		navigate(`/scrummaster/task-assignment?status=${targetStatus}&project=${projectId}&board=${boardType}`);
	};

	const handleTaskClick = (task) => {
		console.log('handleTaskClick called with:', task.title); // Debug log
		// Convert task format to match TaskDetailModal expectations
		const formattedTask = {
			...task,
			status: getTaskStatus(task),
			assignedTo: task.assignee?.id || null,
			estimatedHours: 8, // Mock data
			createdAt: '2025-05-01', // Mock data
			updatedAt: '2025-05-07' // Mock data
		};
		console.log('Setting selected task:', formattedTask); // Debug log
		setSelectedTask(formattedTask);
		setShowTaskModal(true);
		console.log('Modal should be opening...'); // Debug log
	};

	const getTaskStatus = (task) => {
		// Use current board data
		const currentBoard = columns[boardType] || columns.scrum;
		
		// Find which column this task belongs to
		for (const columnId of currentBoard.columnOrder || []) {
			const column = currentBoard.columns?.[columnId];
			if (column?.taskIds.includes(task.id)) {
				const statusMap = {
					// Scrum Board Status
					'todo': 'TO_DO',
					'inProgress': 'IN_PROGRESS',
					'review': 'READY_FOR_TESTING',
					'done': 'DONE',
					// Testing Board Status
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
		setBoardType(newBoardType);
		setColumns(prev => ({
			...prev,
			current: prev[newBoardType]
		}));
	};

	const handleReassignTask = async (taskId, newAssigneeId) => {
		try {
			// In a real app, this would make an API call
			console.log(`Reassigning task ${taskId} to user ${newAssigneeId}`);
			
			// Update local state
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

			// Update selected task if it's the one being reassigned
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
							<button className="mt-4 md:mt-0 bg-primary text-white px-4 py-2 rounded-md hover:bg-hoverBlue transition flex items-center">
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
						{columns[boardType]?.columnOrder?.map(columnId => {
							const column = columns[boardType].columns[columnId];
							const tasks = column.taskIds.map(
								taskId => columns[boardType].tasks[taskId]
							);

							return (
								<Column
									key={column.id}
									column={column}
									tasks={tasks}
									onAddTask={handleAddTask}
									onTaskClick={handleTaskClick}
								/>
							);
						})}
					</div>
				</DndContext>
			</main>

			{/* Task Detail Modal */}
			<TaskDetailModal
				isOpen={showTaskModal}
				onClose={() => {
					console.log('Closing task modal'); // Debug log
					setShowTaskModal(false);
					setSelectedTask(null);
				}}
				task={selectedTask}
				onReassign={handleReassignTask}
				teamMembers={teamMembers}
			/>
			{/* Debug info */}
			{console.log('Modal state - showTaskModal:', showTaskModal, 'selectedTask:', selectedTask?.title)}

			<Footer />
		</div>
	);
}

export default ScrumMasterBoard;
