import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, Clock, AlertTriangle, Kanban, Calendar } from 'lucide-react';
import Navbar from '../../shared/Navbar';
import Footer from '../../shared/Footer';

const DeveloperWorkspace = ({ user }) => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completed: 0,
    inProgress: 0,
    blocked: 0
  });
  
  const [recentTasks, setRecentTasks] = useState([]);
  const [boardData, setBoardData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeveloperData();
  }, [user]);

  const fetchDeveloperData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user?.id) return;

      // Fetch developer board data
      const boardResponse = await fetch(`http://localhost:8080/api/boards/developer?developerId=${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (boardResponse.ok) {
        const boardData = await boardResponse.json();
        setBoardData(boardData);
        
        // Calculate stats from board data
        const allTasks = Object.values(boardData).flat();
        const stats = {
          totalTasks: allTasks.length,
          completed: boardData.DONE?.length || 0,
          inProgress: boardData.IN_PROGRESS?.length || 0,
          blocked: (boardData.BUG_FOUND?.length || 0)
        };
        setStats(stats);
        
        // Set recent tasks (combine TO_DO and IN_PROGRESS, sorted by creation date)
        const recentTasksList = [...(boardData.TO_DO || []), ...(boardData.IN_PROGRESS || [])]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentTasks(recentTasksList);
      }
    } catch (error) {
      console.error('Error fetching developer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DONE': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'TO_DO': return 'bg-gray-100 text-gray-800';
      case 'READY_FOR_TESTING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_TESTING': return 'bg-purple-100 text-purple-800';
      case 'BUG_FOUND': return 'bg-red-100 text-red-800';
      case 'TEST_PASSED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600';
      case 'CRITICAL': return 'text-red-700';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.fullName}!
          </h1>
          <p className="text-gray-600">
            Here's your development workspace
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTasks}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Blocked</p>
                <p className="text-3xl font-bold text-red-600">{stats.blocked}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Tasks</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : recentTasks.length > 0 ? (
              recentTasks.map(task => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-mono text-blue-600">#{task.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {formatStatus(task.status)}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Due: {formatDate(task.dueDate)}</span>
                    <span>Project: {task.projectName}</span>
                  </div>
                  {task.sprintName && (
                    <div className="mt-1 text-xs text-blue-600">
                      Sprint: {task.sprintName}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Kanban className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No recent tasks found</p>
                <p className="text-sm">Tasks assigned to you will appear here</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DeveloperWorkspace;