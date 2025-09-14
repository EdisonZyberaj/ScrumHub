import React from 'react';
import { Target, CheckCircle2, Clock, AlertTriangle, Kanban } from 'lucide-react';
import TaskCard from './TaskCard';

const DeveloperDashboard = ({ stats, projects, tasks, onTaskClick, onUpdateStatus, navigate }) => {
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTasks || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">To Do</p>
              <p className="text-3xl font-bold text-gray-600">{stats.toDo || 0}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{stats.inProgress || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ready for Testing</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.readyForTesting || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">My Projects</h2>
          <span className="text-sm text-gray-500">{projects.length} projects</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.length > 0 ? (
            projects.map(project => (
              <div
                key={project.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all hover:shadow-md"
                onClick={() => {
                  // Use activeSprint if available, otherwise use the first sprint or create a dummy one
                  const sprintId = project.activeSprint?.id || project.sprints?.[0]?.id || 1;
                  navigate(`/developer/board/${project.id}/${sprintId}`);
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
                <div className="mt-3 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm">
                  <Kanban className="w-4 h-4" />
                  <span>
                    {project.activeSprint
                      ? `Active: ${project.activeSprint.name}`
                      : project.sprints?.length > 0
                        ? `View Sprints (${project.sprints.length})`
                        : 'View Project Board'
                    }
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              <Kanban className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No projects found</p>
              <p className="text-sm">You'll see projects you're assigned to here</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Tasks</h2>
        <div className="space-y-4">
          {tasks.slice(0, 5).map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onTaskClick={onTaskClick}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;