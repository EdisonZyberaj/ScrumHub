import React from 'react';
import { ArrowLeft, Calendar, Users, Target, CheckCircle2, Clock, AlertTriangle, BarChart3, TrendingUp } from 'lucide-react';
import TaskCard from './TaskCard';

const DeveloperBoard = ({ project, sprint, tasks, navigate, onTaskClick, onUpdateStatus }) => {
  const columns = [
    {
      id: 'TO_DO',
      title: 'To Do',
      tasks: tasks.filter(t => t.status === 'TO_DO'),
      color: 'bg-gray-50 border-gray-200',
      headerColor: 'bg-gray-100',
      icon: Target
    },
    {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      tasks: tasks.filter(t => t.status === 'IN_PROGRESS'),
      color: 'bg-blue-50 border-blue-200',
      headerColor: 'bg-blue-100',
      icon: Clock
    },
    {
      id: 'READY_FOR_TESTING',
      title: 'Ready for Testing',
      tasks: tasks.filter(t => t.status === 'READY_FOR_TESTING'),
      color: 'bg-yellow-50 border-yellow-200',
      headerColor: 'bg-yellow-100',
      icon: AlertTriangle
    },
    {
      id: 'BUG_FOUND',
      title: 'Bug Found',
      tasks: tasks.filter(t => t.status === 'BUG_FOUND'),
      color: 'bg-red-50 border-red-200',
      headerColor: 'bg-red-100',
      icon: AlertTriangle
    },
    {
      id: 'DONE',
      title: 'Done',
      tasks: tasks.filter(t => t.status === 'DONE'),
      color: 'bg-green-50 border-green-200',
      headerColor: 'bg-green-100',
      icon: CheckCircle2
    }
  ];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/developer')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <span>{project?.name || 'Project'}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-blue-600">{sprint?.name || 'Sprint'}</span>
                </h1>
                <p className="text-gray-600 flex items-center space-x-4 mt-1">
                  <span className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>Development Board</span>
                  </span>
                  {sprint?.startDate && (
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}</span>
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Sprint Progress</div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sprint Stats */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Total Tasks</span>
              </div>
              <div className="text-lg font-bold text-gray-900 mt-1">{totalTasks}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">In Progress</span>
              </div>
              <div className="text-lg font-bold text-blue-900 mt-1">{columns[1].tasks.length}</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-600">Testing</span>
              </div>
              <div className="text-lg font-bold text-yellow-900 mt-1">{columns[2].tasks.length}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">Bugs</span>
              </div>
              <div className="text-lg font-bold text-red-900 mt-1">{columns[3].tasks.length}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Completed</span>
              </div>
              <div className="text-lg font-bold text-green-900 mt-1">{completedTasks}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board - Same Style as ScrumMasterBoard */}
      <div className="grid grid-cols-1 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 gap-6">
        {columns.map(column => {
          const IconComponent = column.icon;
          return (
            <div key={column.id} className="bg-gray-100 rounded-lg shadow-sm pt-4">
              <div className="px-4 pb-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <IconComponent className="w-4 h-4 text-gray-600" />
                  <h3 className="font-bold text-gray-700">{column.title}</h3>
                </div>
                <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                  {column.tasks.length}
                </span>
              </div>

              <div className="min-h-[70vh] p-4 space-y-3">
                {column.tasks.length > 0 ? (
                  column.tasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      showProject={false}
                      onTaskClick={onTaskClick}
                      onUpdateStatus={onUpdateStatus}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <IconComponent className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm text-center">
                      {column.id === 'TO_DO' && 'No tasks to start'}
                      {column.id === 'IN_PROGRESS' && 'No active tasks'}
                      {column.id === 'READY_FOR_TESTING' && 'Nothing ready for testing'}
                      {column.id === 'BUG_FOUND' && 'No bugs found'}
                      {column.id === 'DONE' && 'No completed tasks'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Footer */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>Sprint velocity: {Math.round(completedTasks / Math.max(totalTasks, 1) * 100)}% complete</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>My tasks in this sprint</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperBoard;