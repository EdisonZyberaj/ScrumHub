import React from 'react';
import { X } from 'lucide-react';

const TaskModal = ({ showModal, task, onClose, onUpdateStatus }) => {
  if (!showModal || !task) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'DONE': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'TO_DO': return 'bg-gray-100 text-gray-800';
      case 'READY_FOR_TESTING': return 'bg-yellow-100 text-yellow-800';
      case 'BUG_FOUND': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-700';
      case 'HIGH': return 'text-red-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'TO_DO': return 'IN_PROGRESS';
      case 'IN_PROGRESS': return 'READY_FOR_TESTING';
      case 'BUG_FOUND': return 'IN_PROGRESS';
      case 'READY_FOR_TESTING': return 'IN_PROGRESS';
      default: return null;
    }
  };

  const getStatusActionText = (currentStatus, nextStatus) => {
    switch (currentStatus) {
      case 'TO_DO': return 'Start Task';
      case 'IN_PROGRESS': return 'Ready for Testing';
      case 'BUG_FOUND': return 'Fix & Resume Development';
      case 'READY_FOR_TESTING': return 'Pull Back to Development';
      default: return 'Update Status';
    }
  };

  const getAllowedTransitions = (currentStatus) => {
    switch (currentStatus) {
      case 'TO_DO': return ['IN_PROGRESS'];
      case 'IN_PROGRESS': return ['TO_DO', 'READY_FOR_TESTING'];
      case 'BUG_FOUND': return ['IN_PROGRESS'];
      case 'READY_FOR_TESTING': return ['IN_PROGRESS'];
      default: return [];
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-mono text-blue-600">#{task.id}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
              {formatStatus(task.status)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <h1 className="text-xl font-bold text-gray-900">{task.title}</h1>

          {task.description && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{task.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Priority:</span>
              <span className={`ml-2 ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            <div>
              <span className="font-medium">Due Date:</span>
              <span className="ml-2">{formatDate(task.dueDate)}</span>
            </div>
            <div>
              <span className="font-medium">Project:</span>
              <span className="ml-2">{task.projectName}</span>
            </div>
            {task.sprintName && (
              <div>
                <span className="font-medium">Sprint:</span>
                <span className="ml-2">{task.sprintName}</span>
              </div>
            )}
          </div>

          {/* Status Transition Buttons */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Status Actions</h3>
            <div className="flex flex-wrap gap-2">
              {getAllowedTransitions(task.status).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onUpdateStatus(task.id, status);
                    onClose();
                  }}
                  className={`px-4 py-2 rounded-lg text-white text-sm transition-colors ${
                    status === 'IN_PROGRESS' ? 'bg-blue-600 hover:bg-blue-700' :
                    status === 'READY_FOR_TESTING' ? 'bg-green-600 hover:bg-green-700' :
                    status === 'TO_DO' ? 'bg-gray-600 hover:bg-gray-700' :
                    'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {getStatusActionText(task.status, status)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;