import React, { useState } from 'react';
import { X, Calendar, Target, Play, CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react';

const SprintDetailModal = ({ isOpen, onClose, sprint, onUpdateSprint }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(sprint?.active ? 'active' : 'inactive');

    const handleStatusUpdate = async (newStatus) => {
        console.log('SprintDetailModal: Updating status to:', newStatus); // Debug log
        setIsUpdating(true);
        try {
            await onUpdateSprint(sprint.id, newStatus === 'active');
            console.log('SprintDetailModal: Status update completed'); // Debug log
            onClose();
        } catch (error) {
            console.error('Error updating sprint status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateDaysLeft = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getProgressPercentage = () => {
        if (!sprint?.totalTasks || sprint.totalTasks === 0) return 0;
        return Math.round((sprint.completedTasks / sprint.totalTasks) * 100);
    };

    if (!isOpen || !sprint) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Sprint Details</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Sprint Info */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{sprint.name}</h3>
                        <p className="text-gray-600 mb-4">{sprint.goal}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span className="text-sm">
                                    {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">
                                    {calculateDaysLeft(sprint.endDate) > 0 
                                        ? `${calculateDaysLeft(sprint.endDate)} days remaining`
                                        : calculateDaysLeft(sprint.endDate) === 0
                                        ? 'Ends today'
                                        : `${Math.abs(calculateDaysLeft(sprint.endDate))} days overdue`
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Current Status */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Current Status</h4>
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                                sprint.active 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {sprint.active ? <Play className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                {sprint.active ? 'Active Sprint' : 'Inactive'}
                            </span>
                        </div>
                    </div>

                    {/* Progress */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Progress</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tasks Completed</span>
                                <span>{getProgressPercentage()}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                                    style={{ width: `${getProgressPercentage()}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>{sprint.completedTasks || 0} completed</span>
                                <span>{sprint.totalTasks || 0} total tasks</span>
                            </div>
                        </div>
                    </div>

                    {/* Team Assignment */}
                    {sprint.memberCount && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Team</h4>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Users className="h-4 w-4" />
                                <span className="text-sm">{sprint.memberCount} team members assigned</span>
                            </div>
                        </div>
                    )}

                    {/* Status Management */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Change Sprint Status</h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="space-y-3">
                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sprintStatus"
                                            value="active"
                                            checked={selectedStatus === 'active'}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                        />
                                        <div>
                                            <span className="font-medium text-gray-800 flex items-center gap-2">
                                                <Play className="h-4 w-4 text-green-600" />
                                                Set as Active Sprint
                                            </span>
                                            <p className="text-sm text-gray-600 ml-6">
                                                This will be the current active sprint for the team
                                            </p>
                                        </div>
                                    </label>
                                </div>
                                
                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sprintStatus"
                                            value="inactive"
                                            checked={selectedStatus === 'inactive'}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                        />
                                        <div>
                                            <span className="font-medium text-gray-800 flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-gray-600" />
                                                Set as Inactive
                                            </span>
                                            <p className="text-sm text-gray-600 ml-6">
                                                Move sprint to inactive status (not currently running)
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {selectedStatus !== (sprint.active ? 'active' : 'inactive') && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                        <div className="text-sm text-yellow-700">
                                            <strong>Note:</strong> {selectedStatus === 'active' 
                                                ? 'Setting this sprint as active will deactivate any other currently active sprints.'
                                                : 'Deactivating this sprint will remove it from the active development cycle.'
                                            }
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        disabled={isUpdating}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleStatusUpdate(selectedStatus)}
                        disabled={isUpdating || selectedStatus === (sprint.active ? 'active' : 'inactive')}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-hoverBlue disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isUpdating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                Updating...
                            </>
                        ) : (
                            'Update Sprint Status'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SprintDetailModal;