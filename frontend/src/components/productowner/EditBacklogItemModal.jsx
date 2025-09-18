import React, { useState, useEffect } from 'react';
import { X, Edit, Save, Users, Layers, AlertCircle, Target } from 'lucide-react';

const EditBacklogItemModal = ({ isOpen, onClose, onSubmit, item, epics }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        acceptanceCriteria: '',
        storyPoints: null,
        priority: 'MEDIUM'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (item) {
            setFormData({
                title: item.title || '',
                description: item.description || '',
                acceptanceCriteria: item.acceptanceCriteria || '',
                storyPoints: item.storyPoints || null,
                priority: item.priority || 'MEDIUM'
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === 'storyPoints') {
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

        if (formData.storyPoints !== null && (formData.storyPoints < 1 || formData.storyPoints > 100)) {
            setError('Story points must be between 1 and 100');
            return;
        }

        setIsSubmitting(true);

        try {
            await onSubmit(item.id, formData);
            onClose();
        } catch (error) {
            console.error('Error updating backlog item:', error);
            setError(error.message || 'Failed to update backlog item');
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

    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-blue-100 rounded-lg p-2 mr-3">
                            <Edit className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Edit Backlog Item
                            </h2>
                            <p className="text-sm text-gray-600">
                                Update backlog item details
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
                        {/* Current Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-600">Current Type:</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                    {item.type}
                                </span>
                                <span className="text-sm font-medium text-gray-600">Status:</span>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                                    {item.status}
                                </span>
                            </div>
                            {item.epic && (
                                <div className="flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-purple-600" />
                                    <span className="text-sm text-purple-600">Epic: {item.epic.title}</span>
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter item title"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Describe the backlog item..."
                                required
                            />
                        </div>

                        {/* Acceptance Criteria */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Acceptance Criteria
                            </label>
                            <textarea
                                name="acceptanceCriteria"
                                value={formData.acceptanceCriteria}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Define acceptance criteria..."
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Clear acceptance criteria help determine when this item is complete
                            </p>
                        </div>

                        {/* Story Points and Priority */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Story Points */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Story Points
                                </label>
                                <select
                                    name="storyPoints"
                                    value={formData.storyPoints || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="">Not Estimated</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="5">5</option>
                                    <option value="8">8</option>
                                    <option value="13">13</option>
                                    <option value="21">21</option>
                                    <option value="34">34</option>
                                    <option value="55">55</option>
                                    <option value="89">89</option>
                                </select>
                                <p className="text-sm text-gray-500 mt-1">
                                    Fibonacci sequence for relative sizing
                                </p>
                            </div>

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
                        </div>

                        {/* Ready for Sprint Check */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-blue-900 mb-2">Sprint Readiness Check</h4>
                            <div className="space-y-1">
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full mr-2 ${formData.title.trim() ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-sm text-blue-800">Has title</span>
                                </div>
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full mr-2 ${formData.description.trim() ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-sm text-blue-800">Has description</span>
                                </div>
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full mr-2 ${formData.acceptanceCriteria.trim() ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-sm text-blue-800">Has acceptance criteria</span>
                                </div>
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full mr-2 ${formData.storyPoints ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-sm text-blue-800">Has story points</span>
                                </div>
                            </div>
                            <p className="text-xs text-blue-700 mt-2">
                                Items with all criteria met can be moved to sprints
                            </p>
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
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Update Item
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBacklogItemModal;