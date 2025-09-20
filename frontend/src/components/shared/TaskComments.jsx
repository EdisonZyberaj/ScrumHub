import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Clock } from 'lucide-react';
import dashboardApi from '../../services/dashboardApi';

const TaskComments = ({ taskId, isOpen, onClose }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && taskId) {
            fetchComments();
        }
    }, [isOpen, taskId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await dashboardApi.getTaskComments(taskId);
            setComments(response || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || submitting) return;

        try {
            setSubmitting(true);
            await dashboardApi.addTaskComment(taskId, newComment.trim());
            setNewComment('');
            await fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`;
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">Task Comments</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">
                            Loading comments...
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No comments yet. Be the first to comment!</p>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm">
                                                {comment.user?.fullName || comment.user?.email || 'Anonymous'}
                                            </span>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                {formatDate(comment.createdAt)}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Comment Form */}
                <div className="border-t p-4">
                    <form onSubmit={handleSubmitComment} className="flex gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="3"
                                disabled={submitting}
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    disabled={!newComment.trim() || submitting}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                    {submitting ? 'Posting...' : 'Post Comment'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TaskComments;