import React, { useState } from 'react';
import { X, Layers, Plus } from 'lucide-react';

const CreateEpicModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        businessValue: '',
        priority: 'MEDIUM',
        estimatedStoryPoints: null,
        targetRelease: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === 'estimatedStoryPoints') {
            processedValue = value === '' ? null : parseInt(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        if (!formData.description.trim()) {
            setError('Description is required');
            return;
        }

        if (formData.estimatedStoryPoints !== null && (formData.estimatedStoryPoints < 1 || formData.estimatedStoryPoints > 500)) {
            setError('Estimated story points must be between 1 and 500');
            return;
        }

        setIsSubmitting(true);

        try {
            await onSubmit(formData);

            setFormData({
                title: '',
                description: '',
                businessValue: '',
                priority: 'MEDIUM',
                estimatedStoryPoints: null,
                targetRelease: ''
            });
            onClose();
        } catch (error) {
            console.error('Error creating epic:', error);
            setError(error.message || 'Failed to create epic');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'CRITICAL': return 'border-red-500 bg-red-50 text-red-700';
            case 'HIGH': return 'border-orange-500 bg-orange-50 text-orange-700';
            case 'MEDIUM': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
            case 'LOW': return 'border-green-500 bg-green-50 text-green-700';
            default: return 'border-gray-300 bg-gray-50 text-gray-700';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-purple-100 rounded-lg p-2 mr-3">
                            <Layers className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Create Epic
                            </h2>
                            <p className="text-sm text-gray-600">
                                Create a new epic to group related stories
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Epic Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter epic title"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Describe the epic and its goals..."
                                required
                            />
                        </div>

                        {/* Business Value */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business Value
                            </label>
                            <textarea
                                name="businessValue"
                                value={formData.businessValue}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Explain the business value and benefits..."
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Describe why this epic is important for the business
                            </p>
                        </div>

                        {/* Priority and Story Points */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority
                                </label>
                                <div className="space-y-2">
                                    {[
                                        { value: 'CRITICAL', label: 'Critical' },
                                        { value: 'HIGH', label: 'High' },
                                        { value: 'MEDIUM', label: 'Medium' },
                                        { value: 'LOW', label: 'Low' }
                                    ].map((priority) => (
                                        <label
                                            key={priority.value}
                                            className={`flex items-center p-2 border rounded-lg cursor-pointer transition-colors ${
                                                formData.priority === priority.value
                                                    ? getPriorityColor(priority.value)
                                                    : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="priority"
                                                value={priority.value}
                                                checked={formData.priority === priority.value}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <span className="text-sm font-medium">{priority.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Estimated Story Points */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Estimated Story Points
                                </label>
                                <input
                                    type="number"
                                    name="estimatedStoryPoints"
                                    value={formData.estimatedStoryPoints || ''}
                                    onChange={handleChange}
                                    min="1"
                                    max="500"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="e.g., 50"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Rough estimate of total story points for this epic
                                </p>
                            </div>
                        </div>

                        {/* Target Release */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Release (Optional)
                            </label>
                            <input
                                type="text"
                                name="targetRelease"
                                value={formData.targetRelease}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., v2.1.0"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Which release should this epic target?
                            </p>
                        </div>

                        {/* Epic Information */}
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <h4 className="font-medium text-purple-900 mb-2">📝 Epic Guidelines</h4>
                            <ul className="text-sm text-purple-800 space-y-1">
                                <li>• Epics represent large bodies of work that can span multiple sprints</li>
                                <li>• They should be broken down into smaller user stories</li>
                                <li>• Focus on business value and user outcomes</li>
                                <li>• Consider technical dependencies and constraints</li>
                            </ul>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Layers className="h-4 w-4 mr-2" />
                                    Create Epic
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEpicModal;