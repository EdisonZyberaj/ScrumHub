import React, { useState } from 'react';
import { X, Target, Calendar, Clock, AlertTriangle, CheckCircle, Play, Eye } from 'lucide-react';

const CreateTaskModal = ({ isOpen, onClose, onSubmit, projects, sprints, selectedProject, selectedSprint, preSelectedStatus = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        estimatedHours: '',
        dueDate: '',
        status: preSelectedStatus || 'TO_DO'
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getStatusInfo = (status) => {
        switch (status) {
            case 'TO_DO':
                return { label: 'To Do', color: 'bg-gray-100 text-gray-800', icon: Target, column: 'To Do Column' };
            case 'IN_PROGRESS':
                return { label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: Play, column: 'In Progress Column' };
            case 'READY_FOR_TESTING':
                return { label: 'Ready for Testing', color: 'bg-yellow-100 text-yellow-800', icon: Eye, column: 'Ready for Testing Column' };
            case 'DONE':
                return { label: 'Done', color: 'bg-green-100 text-green-800', icon: CheckCircle, column: 'Done Column' };
            default:
                return { label: 'To Do', color: 'bg-gray-100 text-gray-800', icon: Target, column: 'To Do Column' };
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Task title is required';
        } else if (formData.title.length < 5) {
            newErrors.title = 'Task title must be at least 5 characters';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Task description is required';
        } else if (formData.description.length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        }

        if (!formData.estimatedHours) {
            newErrors.estimatedHours = 'Estimated hours is required';
        } else if (parseInt(formData.estimatedHours) < 1 || parseInt(formData.estimatedHours) > 40) {
            newErrors.estimatedHours = 'Estimated hours must be between 1 and 40';
        }

        if (!formData.dueDate) {
            newErrors.dueDate = 'Due date is required';
        } else {
            const dueDate = new Date(formData.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (dueDate < today) {
                newErrors.dueDate = 'Due date cannot be in the past';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            const taskData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                priority: formData.priority,
                estimatedHours: parseInt(formData.estimatedHours),
                dueDate: formData.dueDate
            };

            await onSubmit(taskData);
            
            // Reset form
            setFormData({
                title: '',
                description: '',
                priority: 'MEDIUM',
                estimatedHours: '',
                dueDate: ''
            });
            setErrors({});
            onClose();
        } catch (error) {
            console.error('Error creating task:', error);
            setErrors({ submit: 'Failed to create task. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({
                title: '',
                description: '',
                priority: 'MEDIUM',
                estimatedHours: '',
                dueDate: ''
            });
            setErrors({});
            onClose();
        }
    };

    if (!isOpen) return null;

    const selectedProjectData = projects.find(p => p.id === selectedProject);
    const selectedSprintData = sprints.find(s => s.id === selectedSprint);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Create New Task</h2>
                    <button 
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Context Info */}
                    {selectedProjectData && selectedSprintData && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-800 mb-1">Creating task for:</h4>
                            <p className="text-blue-700">
                                <span className="font-medium">{selectedSprintData.name}</span> in {selectedProjectData.name}
                            </p>
                        </div>
                    )}

                    {/* Task Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Task Title *
                        </label>
                        <div className="relative">
                            <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="Enter a clear, descriptive task title"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                                    errors.title ? 'border-red-300' : 'border-gray-300'
                                }`}
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    {/* Task Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Describe what needs to be done, acceptance criteria, and any important details..."
                            rows={4}
                            maxLength={1000}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
                                errors.description ? 'border-red-300' : 'border-gray-300'
                            }`}
                            disabled={isSubmitting}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{errors.description || ''}</span>
                            <span>{formData.description.length}/1000</span>
                        </div>
                    </div>

                    {/* Priority and Estimated Hours */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority *
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) => handleInputChange('priority', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                disabled={isSubmitting}
                            >
                                <option value="LOW">🟢 Low Priority</option>
                                <option value="MEDIUM">🟡 Medium Priority</option>
                                <option value="HIGH">🟠 High Priority</option>
                                <option value="CRITICAL">🔴 Critical Priority</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estimated Hours *
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="number"
                                    min="1"
                                    max="40"
                                    value={formData.estimatedHours}
                                    onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                                    placeholder="Hours"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                                        errors.estimatedHours ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.estimatedHours && <p className="mt-1 text-sm text-red-600">{errors.estimatedHours}</p>}
                        </div>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Due Date *
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                                    errors.dueDate ? 'border-red-300' : 'border-gray-300'
                                }`}
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
                    </div>

                    {/* Status Column Indication */}
                    {preSelectedStatus && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                    {React.createElement(getStatusInfo(preSelectedStatus).icon, {
                                        className: "h-5 w-5 text-blue-600"
                                    })}
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-blue-800 mb-1">
                                        📌 Task will be created in:
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusInfo(preSelectedStatus).color}`}>
                                            {getStatusInfo(preSelectedStatus).label}
                                        </span>
                                        <span className="text-sm text-blue-700">
                                            ({getStatusInfo(preSelectedStatus).column})
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Task Creation Tips */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-green-800 mb-2">💡 Task Creation Tips:</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                            <li>• Write clear, actionable task titles</li>
                            <li>• Include acceptance criteria in the description</li>
                            <li>• Break large tasks into smaller, manageable pieces</li>
                            <li>• You can assign this task to team members after creation</li>
                        </ul>
                    </div>

                    {/* Error Message */}
                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                                <p className="text-sm text-red-700">{errors.submit}</p>
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
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-hoverBlue disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                    Creating...
                                </>
                            ) : (
                                'Create Task'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;