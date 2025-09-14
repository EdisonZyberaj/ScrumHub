import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import DeveloperDashboard from '../../components/developer/DeveloperDashboard';
import TasksList from '../../components/developer/TasksList';
import DeveloperBoard from '../../components/developer/DeveloperBoard';
import WorkloadCalendar from '../../components/developer/WorkloadCalendar';
import TaskModal from '../../components/developer/TaskModal';

const Developer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId, sprintId } = useParams();

  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [sprint, setSprint] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completed: 0,
    inProgress: 0,
    blocked: 0
  });

  // Filters for tasks view
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      determineCurrentView();
      fetchData();
    }
  }, [user, location.pathname, projectId, sprintId]);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, statusFilter, priorityFilter, projectFilter]);

  const determineCurrentView = () => {
    const path = location.pathname;
    if (path.includes('/tasks')) {
      setCurrentView('tasks');
    } else if (path.includes('/workload')) {
      setCurrentView('workload');
    } else if (path.includes('/board') && projectId && sprintId) {
      setCurrentView('board');
    } else {
      setCurrentView('dashboard');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token || !user?.id) return;

      if (currentView === 'board' && projectId && sprintId) {
        await Promise.all([
          fetchProjectData(projectId),
          fetchSprintData(sprintId),
          fetchSprintTasks(sprintId)
        ]);
      } else {
        await Promise.all([
          fetchUserTasks(),
          fetchProjects()
        ]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/tasks?assigneeId=${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
        calculateStats(tasksData);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const projectsData = await response.json();
        setProjects(projectsData);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchProjectData = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const projectData = await response.json();
        setProject(projectData);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const fetchSprintData = async (sprintId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/sprints/${sprintId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const sprintData = await response.json();
        setSprint(sprintData);
      } else {
        // If sprint doesn't exist, create a dummy sprint for display
        setSprint({
          id: sprintId,
          name: 'Default Sprint',
          status: 'ACTIVE'
        });
      }
    } catch (error) {
      console.error('Error fetching sprint:', error);
      // Fallback sprint
      setSprint({
        id: sprintId,
        name: 'Default Sprint',
        status: 'ACTIVE'
      });
    }
  };

  const fetchSprintTasks = async (sprintId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/tasks?sprintId=${sprintId}&assigneeId=${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      } else {
        // If no tasks for this sprint, try to get all user tasks for this project
        const projectResponse = await fetch(`http://localhost:8080/api/tasks?assigneeId=${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (projectResponse.ok) {
          const allTasks = await projectResponse.json();
          // Filter tasks by project if we have projectId
          const projectTasks = projectId ?
            allTasks.filter(task => task.projectId?.toString() === projectId?.toString()) :
            allTasks;
          setTasks(projectTasks);
        }
      }
    } catch (error) {
      console.error('Error fetching sprint tasks:', error);
      // Fallback to empty array
      setTasks([]);
    }
  };

  const calculateStats = (tasksData) => {
    const stats = {
      totalTasks: tasksData.length,
      completed: tasksData.filter(t => t.status === 'DONE').length,
      inProgress: tasksData.filter(t => t.status === 'IN_PROGRESS').length,
      blocked: tasksData.filter(t => t.status === 'BUG_FOUND').length
    };
    setStats(stats);
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    if (projectFilter !== 'all') {
      filtered = filtered.filter(task => task.projectId?.toString() === projectFilter);
    }

    setFilteredTasks(filtered);
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };






  const renderContent = () => {
    switch (currentView) {
      case 'tasks':
        return (
          <TasksList
            filteredTasks={filteredTasks}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            onTaskClick={handleTaskClick}
            onUpdateStatus={updateTaskStatus}
          />
        );
      case 'board':
        return (
          <DeveloperBoard
            project={project}
            sprint={sprint}
            tasks={tasks}
            navigate={navigate}
            onTaskClick={handleTaskClick}
            onUpdateStatus={updateTaskStatus}
          />
        );
      case 'workload':
        return <WorkloadCalendar />;
      default:
        return (
          <DeveloperDashboard
            stats={stats}
            projects={projects}
            tasks={tasks}
            onTaskClick={handleTaskClick}
            onUpdateStatus={updateTaskStatus}
            navigate={navigate}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

        {renderContent()}

        <TaskModal
          showModal={showTaskModal}
          task={selectedTask}
          onClose={() => setShowTaskModal(false)}
          onUpdateStatus={updateTaskStatus}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Developer;