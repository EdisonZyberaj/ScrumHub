import React, { useState } from 'react';
import { X, User, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const AssignTaskModal = ({ isOpen, onClose, task, teamMembers, onAssign }) => {
    const [selectedAssignee, setSelectedAssignee] = useState(task?.assigneeId || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleAssign = async () => {
        if (!selectedAssignee) {
            setError('Please select a team member to assign this task to');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await onAssign(task.id, parseInt(selectedAssignee));
            onClose();
        } catch (error) {
            console.error('Error assigning task:', error);
            setError('Failed to assign task. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUnassign = async () => {
        setIsSubmitting(true);
        setError('');

        try {
            await onAssign(task.id, null);
            onClose();
        } catch (error) {
            console.error('Error unassigning task:', error);
            setError('Failed to unassign task. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setSelectedAssignee(task?.assigneeId || '');
            setError('');
            onClose();
        }
    };

    const getWorkloadColor = (current, max) => {
        const percentage = (current / max) * 100;
        if (percentage <= 60) return 'text-green-600 bg-green-100';
        if (percentage <= 80) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getWorkloadStatus = (current, max) => {
        const percentage = (current / max) * 100;
        if (percentage <= 60) return 'Available';
        if (percentage <= 80) return 'Busy';
        return 'At Capacity';
    };

    const isTaskForRole = (memberRole) => {
        if (!task) return true;
        
        const taskTitle = task.title.toLowerCase();
        const taskDescription = task.description.toLowerCase();
        
        if (memberRole === 'TESTER') {
            return taskTitle.includes('test') || 
                   taskDescription.includes('test') || 
                   task.status === 'READY_FOR_TESTING';
        }
        
        if (memberRole === 'DEVELOPER') {
            return !taskTitle.includes('test') || 
                   task.status === 'TO_DO' || 
                   task.status === 'IN_PROGRESS';
        }
        
        return true;
    };

    if (!isOpen || !task) return null;

    const suitableMembers = teamMembers.filter(member => isTaskForRole(member.role));
    const availableMembers = suitableMembers.filter(member => member.currentTasks < member.maxCapacity);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Assign Task</h2>
                    <button 
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Task Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-2">{task.title}</h3>
                        <p className="text-blue-800 text-sm mb-3">{task.description}</p>
                        <div className="flex flex-wrap gap-3 text-sm">
                            <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full">
                                {task.priority} Priority
                            </span>
                            <span className="flex items-center text-blue-700">
                                <Clock className="h-4 w-4 mr-1" />
                                {task.estimatedHours}h estimated
                            </span>
                            <span className="flex items-center text-blue-700">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Current Assignment */}
                    {task.assignee && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-800 mb-2">Currently Assigned To:</h4>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                                        {task.assignee.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-800">{task.assignee.fullName}</p>
                                        <p className="text-sm text-gray-600">{task.assignee.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleUnassign}
                                    disabled={isSubmitting}
                                    className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                                >
                                    Unassign
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Team Member Selection */}
                    <div>
                        <h4 className="font-medium text-gray-800 mb-4">
                            {task.assignee ? 'Reassign to:' : 'Assign to:'}
                        </h4>
                        
                        {/* Available Members */}
                        {availableMembers.length > 0 && (
                            <div className="mb-4">
                                <h5 className="text-sm font-medium text-green-700 mb-2">✅ Available Team Members</h5>
                                <div className="space-y-3">
                                    {availableMembers.map(member => (
                                        <div 
                                            key={member.id}
                                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                                selectedAssignee === member.id.toString() 
                                                    ? 'border-primary bg-primary bg-opacity-5' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            onClick={() => setSelectedAssignee(member.id.toString())}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium mr-3">
                                                        {member.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{member.fullName}</p>
                                                        <p className="text-sm text-gray-600">{member.role}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-xs px-2 py-1 rounded-full ${getWorkloadColor(member.currentTasks, member.maxCapacity)}`}>
                                                        {getWorkloadStatus(member.currentTasks, member.maxCapacity)}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {member.currentTasks}/{member.maxCapacity} tasks
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Busy Members */}
                        {suitableMembers.filter(m => m.currentTasks >= m.maxCapacity).length > 0 && (
                            <div className="mb-4">
                                <h5 className="text-sm font-medium text-orange-700 mb-2">⚠️ At Capacity (Not Recommended)</h5>
                                <div className="space-y-3">
                                    {suitableMembers.filter(m => m.currentTasks >= m.maxCapacity).map(member => (
                                        <div 
                                            key={member.id}
                                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all opacity-60 ${
                                                selectedAssignee === member.id.toString() 
                                                    ? 'border-primary bg-primary bg-opacity-5' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            onClick={() => setSelectedAssignee(member.id.toString())}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-medium mr-3">
                                                        {member.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{member.fullName}</p>
                                                        <p className="text-sm text-gray-600">{member.role}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-xs px-2 py-1 rounded-full ${getWorkloadColor(member.currentTasks, member.maxCapacity)}`}>
                                                        At Capacity
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {member.currentTasks}/{member.maxCapacity} tasks
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No suitable members */}
                        {suitableMembers.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>No suitable team members found for this task</p>
                            </div>
                        )}
                    </div>

                    {/* Assignment Tips */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-yellow-800 mb-2">💡 Assignment Tips:</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Testing tasks are better suited for Testers</li>
                            <li>• Development tasks should go to Developers</li>
                            <li>• Consider team member workload and capacity</li>
                            <li>• Tasks can be reassigned later if needed</li>
                        </ul>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAssign}
                            disabled={isSubmitting || !selectedAssignee}
                            className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-hoverBlue disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                    Assigning...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Assign Task
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignTaskModal;