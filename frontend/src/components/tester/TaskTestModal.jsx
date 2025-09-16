import React, { useState } from 'react';
import { X, TestTube, CheckCircle2, Bug, Clock, User, Calendar, Flag, FileText } from 'lucide-react';

const TaskTestModal = ({ showModal, task, onClose, onUpdateStatus, onReportBug }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [testNotes, setTestNotes] = useState('');

  if (!showModal || !task) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'READY_FOR_TESTING': return 'bg-blue-100 text-blue-800';
      case 'IN_TESTING': return 'bg-yellow-100 text-yellow-800';
      case 'TEST_PASSED': return 'bg-green-100 text-green-800';
      case 'BUG_FOUND': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-700 bg-red-50';
      case 'HIGH': return 'text-red-600 bg-red-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'LOW': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTestingActions = () => {
    switch (task.status) {
      case 'READY_FOR_TESTING':
        return [
          {
            action: () => onUpdateStatus(task.id, 'IN_TESTING'),
            label: 'Start Testing',
            icon: TestTube,
            color: 'bg-blue-600 hover:bg-blue-700'
          }
        ];
      case 'IN_TESTING':
        return [
          {
            action: () => onUpdateStatus(task.id, 'TEST_PASSED'),
            label: 'Mark as Passed',
            icon: CheckCircle2,
            color: 'bg-green-600 hover:bg-green-700'
          },
          {
            action: () => onReportBug(task),
            label: 'Report Bug',
            icon: Bug,
            color: 'bg-red-600 hover:bg-red-700'
          }
        ];
      default:
        return [];
    }
  };

  const testingActions = getTestingActions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TestTube className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-sm text-gray-500">#{task.id}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="px-6 flex space-x-8">
            {[
              { key: 'details', label: 'Task Details', icon: FileText },
              { key: 'testing', label: 'Testing', icon: TestTube }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Description */}
              {task.description && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{task.description}</p>
                </div>
              )}

              {/* Acceptance Criteria */}
              {task.acceptanceCriteria && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Acceptance Criteria</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-blue-900 leading-relaxed">{task.acceptanceCriteria}</p>
                  </div>
                </div>
              )}

              {/* Task Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Task Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Assigned Developer</p>
                      <p className="text-sm text-gray-600">{task.assigneeName || 'Unassigned'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Flag className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Priority</p>
                      <p className="text-sm text-gray-600">{task.priority}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Estimated Hours</p>
                      <p className="text-sm text-gray-600">{task.estimatedHours || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Due Date</p>
                      <p className="text-sm text-gray-600">{formatDate(task.dueDate)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Project Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700">Project: {task.projectName}</p>
                  {task.sprintName && (
                    <p className="text-sm text-gray-600 mt-1">Sprint: {task.sprintName}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testing' && (
            <div className="space-y-6">
              {/* Testing Guide */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Testing Guide</h3>
                <div className="bg-purple-50 rounded-lg p-4 space-y-3">
                  <div>
                    <h4 className="font-medium text-purple-900">1. Review Requirements</h4>
                    <p className="text-sm text-purple-800">Carefully read the task description and acceptance criteria above.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-900">2. Test Functionality</h4>
                    <p className="text-sm text-purple-800">Verify that the implemented feature works as described.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-900">3. Edge Cases</h4>
                    <p className="text-sm text-purple-800">Test with various inputs, including invalid data and edge cases.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-900">4. User Experience</h4>
                    <p className="text-sm text-purple-800">Ensure the feature is intuitive and provides good user experience.</p>
                  </div>
                </div>
              </div>

              {/* Testing Notes */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Testing Notes</h3>
                <textarea
                  value={testNotes}
                  onChange={(e) => setTestNotes(e.target.value)}
                  placeholder="Add your testing notes, observations, or comments here..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Current Status */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Current Status</h3>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    task.status === 'READY_FOR_TESTING' ? 'bg-blue-500' :
                    task.status === 'IN_TESTING' ? 'bg-yellow-500' :
                    task.status === 'TEST_PASSED' ? 'bg-green-500' :
                    task.status === 'BUG_FOUND' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="font-medium text-gray-900">
                    {task.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>

          <div className="flex space-x-3">
            {testingActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    action.action();
                    onClose();
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${action.color}`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskTestModal;