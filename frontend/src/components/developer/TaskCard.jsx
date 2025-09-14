import React from 'react';
import { MoreHorizontal, Flag, Clock, Calendar, Play, Eye } from 'lucide-react';

const TaskCard = ({ task, showProject = true, onTaskClick, onUpdateStatus }) => {
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
      case 'READY_FOR_TESTING': return 'IN_PROGRESS'; // Allow pull back
      default: return null;
    }
  };

  const getStatusActionText = (currentStatus, nextStatus) => {
    switch (currentStatus) {
      case 'TO_DO': return 'Start';
      case 'IN_PROGRESS': return 'Ready for Testing';
      case 'BUG_FOUND': return 'Fix & Resume';
      case 'READY_FOR_TESTING': return 'Pull Back';
      default: return 'Update';
    }
  };

  const nextStatus = getNextStatus(task.status);
  const canAdvance = nextStatus && ['TO_DO', 'IN_PROGRESS', 'BUG_FOUND', 'READY_FOR_TESTING'].includes(task.status);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-blue-600">#{task.id}</span>
          <Flag className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
        </div>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{task.title}</h3>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center space-x-3">
          {task.estimatedHours && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{task.estimatedHours}h</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {formatStatus(task.status)}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)} bg-gray-50`}>
            {task.priority}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          {canAdvance && (
            <button
              onClick={() => onUpdateStatus(task.id, nextStatus)}
              className={`flex items-center space-x-1 px-2 py-1 text-white text-xs rounded transition-colors ${
                task.status === 'BUG_FOUND' ? 'bg-red-600 hover:bg-red-700' :
                task.status === 'READY_FOR_TESTING' ? 'bg-yellow-600 hover:bg-yellow-700' :
                'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Play className="w-3 h-3" />
              <span>{getStatusActionText(task.status, nextStatus)}</span>
            </button>
          )}

          <button
            onClick={() => onTaskClick(task)}
            className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>
      </div>

      {showProject && (
        <div className="mt-2 text-xs text-gray-500">
          <span>Project: {task.projectName}</span>
          {task.sprintName && <span> • Sprint: {task.sprintName}</span>}
        </div>
      )}
    </div>
  );
};

export default TaskCard;