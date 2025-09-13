import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Calendar, 
    User, 
    Flag, 
    Clock, 
    CheckCircle,
    AlertTriangle,
    Bug,
    TestTube
} from 'lucide-react';

const TasksOverview = ({ tasks, limit = 6 }) => {
    const getPriorityColor = (priority) => {
        const priorityColors = {
            'CRITICAL': 'text-red-600 bg-red-50',
            'HIGH': 'text-orange-600 bg-orange-50',
            'MEDIUM': 'text-blue-600 bg-blue-50',
            'LOW': 'text-green-600 bg-green-50'
        };
        return priorityColors[priority] || priorityColors.MEDIUM;
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'TO_DO': 'bg-gray-100 text-gray-800',
            'IN_PROGRESS': 'bg-blue-100 text-blue-800',
            'READY_FOR_TESTING': 'bg-purple-100 text-purple-800',
            'IN_TESTING': 'bg-yellow-100 text-yellow-800',
            'BUG_FOUND': 'bg-red-100 text-red-800',
            'TEST_PASSED': 'bg-green-100 text-green-800',
            'DONE': 'bg-emerald-100 text-emerald-800'
        };
        return statusColors[status] || statusColors.TO_DO;
    };

    const getStatusIcon = (status) => {
        const statusIcons = {
            'TO_DO': Clock,
            'IN_PROGRESS': Clock,
            'READY_FOR_TESTING': TestTube,
            'IN_TESTING': TestTube,
            'BUG_FOUND': Bug,
            'TEST_PASSED': CheckCircle,
            'DONE': CheckCircle
        };
        return statusIcons[status] || Clock;
    };

    const getPriorityIcon = (priority) => {
        if (priority === 'CRITICAL') return AlertTriangle;
        return Flag;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateDaysLeft = (dueDate) => {
        if (!dueDate) return null;
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getDueDateColor = (dueDate) => {
        const daysLeft = calculateDaysLeft(dueDate);
        if (daysLeft === null) return 'text-gray-500';
        if (daysLeft < 0) return 'text-red-600';
        if (daysLeft <= 1) return 'text-red-500';
        if (daysLeft <= 3) return 'text-orange-500';
        return 'text-gray-500';
    };

    const displayTasks = tasks.slice(0, limit);

    if (!displayTasks.length) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No tasks found</p>
                <p className="text-sm text-gray-400 mt-1">
                    Tasks will appear here once they are created
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayTasks.map((task) => {
                const StatusIcon = getStatusIcon(task.status);
                const PriorityIcon = getPriorityIcon(task.priority);
                const daysLeft = calculateDaysLeft(task.dueDate);

                return (
                    <div
                        key={task.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-medium text-gray-900 text-sm leading-tight pr-2 line-clamp-2">
                                {task.title}
                            </h3>
                            <div className={`flex items-center px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                                <PriorityIcon className="h-3 w-3 mr-1" />
                                {task.priority}
                            </div>
                        </div>

                        {/* Status and Project */}
                        <div className="flex items-center justify-between mb-4">
                            <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {task.status.replace(/_/g, ' ')}
                            </div>
                            {task.projectName && (
                                <span className="text-xs text-gray-500 truncate max-w-24">
                                    {task.projectName}
                                </span>
                            )}
                        </div>

                        {/* Assignee */}
                        {task.assignee && (
                            <div className="flex items-center mb-3 text-sm text-gray-600">
                                <User className="h-4 w-4 mr-2" />
                                <span className="truncate">
                                    {task.assignee.fullName}
                                </span>
                            </div>
                        )}

                        {/* Due Date and Actions */}
                        <div className="flex items-center justify-between">
                            <div className={`flex items-center text-sm ${getDueDateColor(task.dueDate)}`}>
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{formatDate(task.dueDate)}</span>
                                {daysLeft !== null && (
                                    <span className="ml-2 text-xs">
                                        ({daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Today' : `${daysLeft}d left`})
                                    </span>
                                )}
                            </div>
                            
                            <Link
                                to={`/scrummaster/project/${task.projectId}`}
                                className="text-primary hover:text-blue-600 text-sm font-medium"
                            >
                                View
                            </Link>
                        </div>

                        {/* Sprint Info */}
                        {task.sprintName && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="flex items-center text-xs text-gray-500">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                    <span className="truncate">{task.sprintName}</span>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TasksOverview;