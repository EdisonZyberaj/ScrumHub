import React from 'react';
import { TestTube, CheckCircle2, Bug, AlertTriangle, Play, Kanban, Clock } from 'lucide-react';
import TestTaskCard from './TestTaskCard';

const TesterDashboard = ({ stats, projects, tasks, onTaskClick, onUpdateStatus, onReportBug, navigate }) => {
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ready for Testing</p>
              <p className="text-3xl font-bold text-blue-600">{stats.readyForTesting || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TestTube className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Testing</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.inTesting || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Test Passed</p>
              <p className="text-3xl font-bold text-green-600">{stats.testPassed || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bugs Found</p>
              <p className="text-3xl font-bold text-red-600">{stats.bugFound || 0}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Bug className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/tester/tasks')}
            className="flex items-center justify-center space-x-2 p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <TestTube className="w-5 h-5" />
            <span>View Tasks to Test</span>
          </button>

          <button
            onClick={() => navigate('/tester/bugs')}
            className="flex items-center justify-center space-x-2 p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Bug className="w-5 h-5" />
            <span>Bug Reports</span>
          </button>

          <button
            onClick={() => navigate('/tester/testcases')}
            className="flex items-center justify-center space-x-2 p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Test Cases</span>
          </button>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Testing Projects</h2>
          <span className="text-sm text-gray-500">{projects.length} projects</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.length > 0 ? (
            projects.map(project => (
              <div
                key={project.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all hover:shadow-md"
                onClick={() => {
                  const sprintId = project.activeSprint?.id || project.sprints?.[0]?.id || 1;
                  navigate(`/tester/board/${project.id}/${sprintId}`);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    project.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{project.memberCount || 0} members</span>
                  <span>{project.completedTasks || 0}/{project.totalTasks || 0} tasks</span>
                </div>
                <div className="mt-3 flex items-center justify-center space-x-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm">
                  <TestTube className="w-4 h-4" />
                  <span>Testing Board</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              <TestTube className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No projects found</p>
              <p className="text-sm">You'll see projects you're assigned to here</p>
            </div>
          )}
        </div>
      </div>

      {/* Tasks Ready for Testing */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Tasks Ready for Testing</h2>
          <button
            onClick={() => navigate('/tester/tasks')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All →
          </button>
        </div>
        <div className="space-y-4">
          {tasks.filter(task => task.status === 'READY_FOR_TESTING').slice(0, 5).map(task => (
            <TestTaskCard
              key={task.id}
              task={task}
              onTaskClick={onTaskClick}
              onUpdateStatus={onUpdateStatus}
              onReportBug={onReportBug}
            />
          ))}
          {tasks.filter(task => task.status === 'READY_FOR_TESTING').length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Play className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No tasks ready for testing</p>
              <p className="text-sm">Tasks will appear here when developers mark them ready</p>
            </div>
          )}
        </div>
      </div>

      {/* Current Testing */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Currently Testing</h2>
        <div className="space-y-4">
          {tasks.filter(task => task.status === 'IN_TESTING').slice(0, 3).map(task => (
            <TestTaskCard
              key={task.id}
              task={task}
              onTaskClick={onTaskClick}
              onUpdateStatus={onUpdateStatus}
              onReportBug={onReportBug}
            />
          ))}
          {tasks.filter(task => task.status === 'IN_TESTING').length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No tasks currently in testing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TesterDashboard;