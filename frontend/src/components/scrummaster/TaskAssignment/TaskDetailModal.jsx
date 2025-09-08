import React, { useState, useEffect } from 'react';
import { X, Target, Calendar, Clock, AlertTriangle, CheckCircle, Play, Eye, User, Edit } from 'lucide-react';

const TaskDetailModal = ({ isOpen, onClose, task, onReassign, teamMembers = [] }) => {
    const [isReassigning, setIsReassigning] = useState(false);
    const [selectedAssignee, setSelectedAssignee] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (task && task.assignedTo) {
            setSelectedAssignee(task.assignedTo.toString());
        } else {
            setSelectedAssignee('');
        }
    }, [task]);

    const getStatusInfo = (status) => {
        switch (status) {
            case 'TO_DO':
                return { label: 'To Do', color: 'bg-gray-100 text-gray-800', icon: Target };
            case 'IN_PROGRESS':
                return { label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: Play };
            case 'READY_FOR_TESTING':
                return { label: 'Ready for Testing', color: 'bg-yellow-100 text-yellow-800', icon: Eye };
            case 'DONE':
                return { label: 'Done', color: 'bg-green-100 text-green-800', icon: CheckCircle };
            default:
                return { label: 'To Do', color: 'bg-gray-100 text-gray-800', icon: Target };
        }
    };

    const getPriorityInfo = (priority) => {
        switch (priority) {
            case 'LOW':
                return { label: 'Low Priority', color: 'bg-green-100 text-green-800', emoji: '🟢' };
            case 'MEDIUM':
                return { label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800', emoji: '🟡' };
            case 'HIGH':
                return { label: 'High Priority', color: 'bg-orange-100 text-orange-800', emoji: '🟠' };
            case 'CRITICAL':
                return { label: 'Critical Priority', color: 'bg-red-100 text-red-800', emoji: '🔴' };
            default:
                return { label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800', emoji: '🟡' };
        }
    };

    const getAssignedUser = (userId) => {
        return teamMembers.find(member => member.id === userId) || null;
    };

    const handleReassign = async () => {
        if (!selectedAssignee) return;

        setIsSubmitting(true);
        try {
            await onReassign(task.id, selectedAssignee);
            setIsReassigning(false);
        } catch (error) {
            console.error('Error reassigning task:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!isOpen || !task) return null;

    const statusInfo = getStatusInfo(task.status);
    const priorityInfo = getPriorityInfo(task.priority);
    const assignedUser = getAssignedUser(task.assignedTo);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Task Details</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Task Title and Status */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h3>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${statusInfo.color}`}>
                                    {React.createElement(statusInfo.icon, { className: "h-3 w-3" })}
                                    {statusInfo.label}
                                </span>
                                <span className={`text-xs px-3 py-1 rounded-full ${priorityInfo.color}`}>
                                    {priorityInfo.emoji} {priorityInfo.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                            {task.description}
                        </div>
                    </div>

                    {/* Task Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Estimated Hours</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="h-4 w-4" />
                                {task.estimatedHours} hours
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Due Date</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                {formatDate(task.dueDate)}
                            </div>
                        </div>
                    </div>

                    {/* Current Assignment */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-700">Assigned To</h4>
                            <button
                                onClick={() => setIsReassigning(!isReassigning)}
                                className="text-primary hover:text-hoverBlue text-sm flex items-center gap-1"
                            >
                                <Edit className="h-3 w-3" />
                                {isReassigning ? 'Cancel' : 'Reassign'}
                            </button>
                        </div>

                        {!isReassigning ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                {assignedUser ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-medium">
                                            {assignedUser.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{assignedUser.name}</p>
                                            <p className="text-sm text-gray-600">{assignedUser.email}</p>
                                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                {assignedUser.role}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <User className="h-4 w-4" />
                                        Unassigned
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <select
                                    value={selectedAssignee}
                                    onChange={(e) => setSelectedAssignee(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    disabled={isSubmitting}
                                >
                                    <option value="">Unassigned</option>
                                    {teamMembers
                                        .filter(member => member.role === 'DEVELOPER' || member.role === 'TESTER')
                                        .map(member => (
                                        <option key={member.id} value={member.id}>
                                            {member.name} ({member.role})
                                        </option>
                                    ))}
                                </select>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleReassign}
                                        disabled={isSubmitting || selectedAssignee === task.assignedTo?.toString()}
                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-hoverBlue disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
                                    >
                                        {isSubmitting && <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent" />}
                                        {isSubmitting ? 'Reassigning...' : 'Reassign Task'}
                                    </button>
                                    <button
                                        onClick={() => setIsReassigning(false)}
                                        disabled={isSubmitting}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Task Timeline */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Task Timeline</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Created:</span>
                                <span>{formatDate(task.createdAt)}</span>
                            </div>
                            {task.updatedAt && task.updatedAt !== task.createdAt && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Last Updated:</span>
                                    <span>{formatDate(task.updatedAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;