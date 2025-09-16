import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, TestTube, Clock, CheckCircle2, Bug, Filter, Search,
  Plus, MoreHorizontal, Calendar, AlertCircle, Target, LayoutDashboard,
  User, Tag
} from 'lucide-react';
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

// Utility functions (copied from ScrumMasterBoard)
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

// Sortable Task Item Component (copied from ScrumMasterBoard)
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
        {(task.tags || []).map(tag =>
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
            {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
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
          className={`text-xs ${task.dueDate && calculateDaysLeft(
            task.dueDate
          ) <= 2
            ? "text-red-500"
            : "text-gray-500"}`}>
          {task.dueDate && calculateDaysLeft(task.dueDate) <= 0
            ? "Overdue"
            : task.dueDate ? `${calculateDaysLeft(task.dueDate)}d` : ''}
        </div>
      </div>
      </div> {/* Close click handler div */}
    </div>
  );
};

// Column Component (copied from ScrumMasterBoard)
const Column = ({ column, tasks, onTaskClick }) => {
  return (
    <div className="bg-gray-100 rounded-lg shadow-sm pt-4">
      <div className="px-4 pb-3 flex justify-between items-center">
        <h3 className="font-bold text-gray-700">
          {column.title}
        </h3>
        <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
          {column.taskIds ? column.taskIds.length : tasks.length}
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

        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="h-12 w-12 mx-auto mb-2 text-gray-400 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300"></div>
            </div>
            <p className="text-sm">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TesterBoard = ({ project, sprint, tasks, navigate, onTaskClick, onUpdateStatus, onReportBug }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [columns, setColumns] = useState({});
  const [boardType, setBoardType] = useState('testing'); // 'scrum' or 'testing'
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    // Process tasks into board structure (similar to ScrumMasterBoard)
    const processTasksIntoBoard = () => {
      const processedTasks = {};
      let taskCounter = 1;

      const processTasksForColumn = (taskList) => {
        if (!taskList || !Array.isArray(taskList)) return [];

        return taskList.map(task => {
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
              name: task.assignee.fullName || task.assignee.username,
              avatar: null
            } : null,
            tags: task.tags || []
          };
          return taskId;
        });
      };

      // Group tasks by status
      const tasksByStatus = {
        TO_DO: tasks.filter(task => task.status === 'TO_DO'),
        IN_PROGRESS: tasks.filter(task => task.status === 'IN_PROGRESS'),
        READY_FOR_TESTING: tasks.filter(task => task.status === 'READY_FOR_TESTING'),
        IN_TESTING: tasks.filter(task => task.status === 'IN_TESTING'),
        BUG_FOUND: tasks.filter(task => task.status === 'BUG_FOUND'),
        TEST_PASSED: tasks.filter(task => task.status === 'TEST_PASSED'),
        DONE: tasks.filter(task => task.status === 'DONE')
      };

      const boardData = {
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

      setColumns({
        scrum: boardData.scrum,
        testing: boardData.testing,
        current: boardData.testing
      });
      setIsLoading(false);
    };

    processTasksIntoBoard();
  }, [tasks]);

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

  const handleBoardTypeSwitch = (newBoardType) => {
    setBoardType(newBoardType);
    setColumns(prev => ({
      ...prev,
      current: prev[newBoardType] || prev.testing || {}
    }));
  };

  const handleTaskClick = (task) => {
    if (!task || !task.title) {
      console.error('Invalid task data received:', task);
      return;
    }

    // Convert task format to match expectations
    const formattedTask = {
      ...task,
      status: getTaskStatus(task),
      assignedTo: task.assignee?.id || null,
      estimatedHours: task.estimatedHours || 8,
      createdAt: task.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: task.updatedAt || new Date().toISOString().split('T')[0]
    };
    onTaskClick(formattedTask);
  };

  const getTaskStatus = (task) => {
    const currentBoard = columns[boardType] || columns.testing;

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/tester')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">{project?.name || 'Project'}</h1>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Testing Board
              </span>
            </div>
            <p className="text-gray-600">
              {sprint?.name || 'Sprint'} • {tasks.length} tasks
            </p>
          </div>
        </div>
      </div>

      {/* Sprint Info */}
      {sprint && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="mb-3">
            <h3 className="font-medium text-gray-700">Sprint Goal</h3>
            <p className="text-gray-600">{sprint.goal}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${sprint.progress || 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{sprint.progress || 0}% completed</span>
            <span>
              {sprint.endDate ? calculateDaysLeft(sprint.endDate) : 0} days remaining
            </span>
          </div>
        </div>
      )}

      {/* Board Type Switcher */}
      <div className="bg-white rounded-lg shadow-sm p-4">
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

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 gap-6">
          {columns[boardType]?.columnOrder?.map(columnId => {
            const column = columns[boardType]?.columns?.[columnId];
            if (!column) return null;

            const tasks = (column.taskIds || []).map(taskId => {
              const task = columns[boardType]?.tasks?.[taskId];
              if (!task) return null;
              return task;
            }).filter(Boolean);

            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                onTaskClick={handleTaskClick}
              />
            );
          }).filter(Boolean)}
        </div>
      </DndContext>
    </div>
  );
};

export default TesterBoard;