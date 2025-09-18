import React, { useState } from 'react';
import { X, Plus, Users, Layers, AlertCircle, Target } from 'lucide-react';

const CreateBacklogItemModal = ({ isOpen, onClose, onSubmit, epics }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'USER_STORY',
        epicId: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? null : value
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

        setIsSubmitting(true);

        try {
            await onSubmit({
                ...formData,
                epicId: formData.epicId === 'null' ? null : formData.epicId
            });

            setFormData({
                title: '',
                description: '',
                type: 'USER_STORY',
                epicId: null
            });
            onClose();
        } catch (error) {
            console.error('Error creating backlog item:', error);
            setError(error.message || 'Failed to create backlog item');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'USER_STORY': return <Users className="h-4 w-4" />;
            case 'FEATURE': return <Layers className="h-4 w-4" />;
            case 'BUG': return <AlertCircle className="h-4 w-4" />;
            case 'TECHNICAL_DEBT': return <Target className="h-4 w-4" />;
            case 'SPIKE': return <Target className="h-4 w-4" />;
            case 'EPIC_STORY': return <Users className="h-4 w-4" />;
            case 'ENHANCEMENT': return <Layers className="h-4 w-4" />;
            default: return <Users className="h-4 w-4" />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-primary/10 rounded-lg p-2 mr-3">
                            <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Create Backlog Item
                            </h2>
                            <p className="text-sm text-gray-600">
                                Add a new item to the product backlog
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

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {[
                                    { value: 'USER_STORY', label: 'User Story' },
                                    { value: 'FEATURE', label: 'Feature' },
                                    { value: 'BUG', label: 'Bug' },
                                    { value: 'TECHNICAL_DEBT', label: 'Tech Debt' },
                                    { value: 'SPIKE', label: 'Spike' },
                                    { value: 'EPIC_STORY', label: 'Epic Story' },
                                    { value: 'ENHANCEMENT', label: 'Enhancement' }
                                ].map((type) => (
                                    <label
                                        key={type.value}
                                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                            formData.type === type.value
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="type"
                                            value={type.value}
                                            checked={formData.type === type.value}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center">
                                            {getTypeIcon(type.value)}
                                            <span className="ml-2 text-sm font-medium">{type.label}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Epic Assignment */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Epic (Optional)
                            </label>
                            <select
                                name="epicId"
                                value={formData.epicId || 'null'}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="null">No Epic</option>
                                {epics.map(epic => (
                                    <option key={epic.id} value={epic.id}>
                                        {epic.title}
                                    </option>
                                ))}
                            </select>
                            {epics.length === 0 && (
                                <p className="text-sm text-gray-500 mt-1">
                                    No epics available. Create an epic first to assign this item.
                                </p>
                            )}
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
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-hoverBlue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Item
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBacklogItemModal;