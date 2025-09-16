import React from 'react';
import { Search, Filter, TestTube, Clock, CheckCircle2, Bug } from 'lucide-react';
import TestTaskCard from './TestTaskCard';

const TasksToTest = ({
  filteredTasks,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  onTaskClick,
  onUpdateStatus,
  onReportBug
}) => {
  const statusCounts = {
    all: filteredTasks.length,
    ready_for_testing: filteredTasks.filter(t => t.status === 'READY_FOR_TESTING').length,
    in_testing: filteredTasks.filter(t => t.status === 'IN_TESTING').length,
    test_passed: filteredTasks.filter(t => t.status === 'TEST_PASSED').length,
    bug_found: filteredTasks.filter(t => t.status === 'BUG_FOUND').length
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready_for_testing': return <TestTube className="w-4 h-4" />;
      case 'in_testing': return <Clock className="w-4 h-4" />;
      case 'test_passed': return <CheckCircle2 className="w-4 h-4" />;
      case 'bug_found': return <Bug className="w-4 h-4" />;
      default: return <Filter className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready_for_testing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in_testing': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'test_passed': return 'text-green-600 bg-green-50 border-green-200';
      case 'bug_found': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Tasks to Test</h2>
          <p className="text-gray-600">Manage and execute test cases for development tasks</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Tasks' },
            { key: 'ready_for_testing', label: 'Ready for Testing' },
            { key: 'in_testing', label: 'In Testing' },
            { key: 'test_passed', label: 'Test Passed' },
            { key: 'bug_found', label: 'Bug Found' }
          ].map((status) => (
            <button
              key={status.key}
              onClick={() => setStatusFilter(status.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                statusFilter === status.key
                  ? getStatusColor(status.key)
                  : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              {getStatusIcon(status.key)}
              <span>{status.label}</span>
              <span className="ml-1 px-2 py-0.5 bg-white rounded-full text-xs font-medium">
                {statusCounts[status.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TestTaskCard
              key={task.id}
              task={task}
              onTaskClick={onTaskClick}
              onUpdateStatus={onUpdateStatus}
              onReportBug={onReportBug}
            />
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <TestTube className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters to see more tasks'
                : 'No tasks are currently available for testing'}
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {filteredTasks.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.ready_for_testing}</div>
              <div className="text-sm text-gray-600">Ready for Testing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.in_testing}</div>
              <div className="text-sm text-gray-600">In Testing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.test_passed}</div>
              <div className="text-sm text-gray-600">Test Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{statusCounts.bug_found}</div>
              <div className="text-sm text-gray-600">Bugs Found</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksToTest;