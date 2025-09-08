import React, { useState } from 'react';
import { X, Calendar, Target, FileText } from 'lucide-react';

const CreateSprintModal = ({ isOpen, onClose, onSubmit, projects, selectedProject }) => {
    const [formData, setFormData] = useState({
        name: '',
        goal: '',
        startDate: '',
        endDate: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Sprint name is required';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Sprint name must be at least 3 characters';
        }

        if (!formData.goal.trim()) {
            newErrors.goal = 'Sprint goal is required';
        } else if (formData.goal.length < 10) {
            newErrors.goal = 'Sprint goal must be at least 10 characters';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'End date is required';
        }

        // Date validation
        if (formData.startDate && formData.endDate) {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (startDate < today) {
                newErrors.startDate = 'Start date cannot be in the past';
            }
            
            if (endDate <= startDate) {
                newErrors.endDate = 'End date must be after start date';
            }

            // Check if sprint duration is reasonable (1-4 weeks)
            const diffTime = endDate - startDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 7) {
                newErrors.endDate = 'Sprint should be at least 1 week long';
            } else if (diffDays > 28) {
                newErrors.endDate = 'Sprint should not exceed 4 weeks';
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
            const sprintData = {
                name: formData.name.trim(),
                goal: formData.goal.trim(),
                startDate: formData.startDate,
                endDate: formData.endDate
            };

            await onSubmit(sprintData);
            
            // Reset form
            setFormData({
                name: '',
                goal: '',
                startDate: '',
                endDate: ''
            });
            setErrors({});
            onClose();
        } catch (error) {
            console.error('Error creating sprint:', error);
            setErrors({ submit: 'Failed to create sprint. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({
                name: '',
                goal: '',
                startDate: '',
                endDate: ''
            });
            setErrors({});
            onClose();
        }
    };

    // Auto-suggest sprint name based on project
    const generateSprintName = () => {
        const project = projects.find(p => p.id === selectedProject);
        if (project) {
            const sprintNumber = Math.floor(Math.random() * 20) + 1; // Mock sprint number
            return `${project.key} Sprint ${sprintNumber}`;
        }
        return '';
    };

    const handleAutoGenerateName = () => {
        const suggestedName = generateSprintName();
        if (suggestedName) {
            handleInputChange('name', suggestedName);
        }
    };

    // Calculate sprint duration in days
    const getSprintDuration = () => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            const diffTime = end - start;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays > 0 ? diffDays : 0;
        }
        return 0;
    };

    if (!isOpen) return null;

    const selectedProjectData = projects.find(p => p.id === selectedProject);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Create New Sprint</h2>
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
                    {/* Project Info */}
                    {selectedProjectData && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-800 mb-1">Creating sprint for:</h4>
                            <p className="text-blue-700">
                                <span className="font-medium">{selectedProjectData.name}</span> ({selectedProjectData.key})
                            </p>
                        </div>
                    )}

                    {/* Sprint Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sprint Name *
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter sprint name"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                                        errors.name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAutoGenerateName}
                                className="px-3 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition"
                                disabled={isSubmitting}
                            >
                                Auto
                            </button>
                        </div>
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Sprint Goal */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sprint Goal *
                        </label>
                        <div className="relative">
                            <Target className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                            <textarea
                                value={formData.goal}
                                onChange={(e) => handleInputChange('goal', e.target.value)}
                                placeholder="What do you want to achieve in this sprint? Describe the main objective and value..."
                                rows={4}
                                maxLength={500}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
                                    errors.goal ? 'border-red-300' : 'border-gray-300'
                                }`}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{errors.goal || ''}</span>
                            <span>{formData.goal.length}/500</span>
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date *
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                                        errors.startDate ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date *
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                                        errors.endDate ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                        </div>
                    </div>

                    {/* Sprint Duration Info */}
                    {getSprintDuration() > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-800">
                                <span className="font-medium">Sprint Duration:</span> {getSprintDuration()} days
                                {getSprintDuration() === 14 && <span className="ml-2">✅ Recommended 2-week sprint</span>}
                                {getSprintDuration() < 7 && <span className="ml-2">⚠️ Very short sprint</span>}
                                {getSprintDuration() > 21 && <span className="ml-2">⚠️ Consider shorter sprints</span>}
                            </p>
                        </div>
                    )}

                    {/* Sprint Planning Tips */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Sprint Planning Tips:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Make sure the sprint goal is clear and achievable</li>
                            <li>• 2-week sprints (14 days) are most common and recommended</li>
                            <li>• You can add tasks to this sprint after creation</li>
                            <li>• Team members will be assigned to tasks during sprint execution</li>
                        </ul>
                    </div>

                    {/* Error Message */}
                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-700">{errors.submit}</p>
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
                                'Create Sprint'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSprintModal;