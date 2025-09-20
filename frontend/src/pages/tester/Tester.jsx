import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import TesterDashboard from '../../components/tester/TesterDashboard';
import TasksToTest from '../../components/tester/TasksToTest';
import TesterBoard from '../../components/tester/TesterBoard';
import TaskTestModal from '../../components/tester/TaskTestModal';
import BugReportModal from '../../components/tester/BugReportModal';

const Tester = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId, sprintId } = useParams();

  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [boardData, setBoardData] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showBugModal, setShowBugModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    readyForTesting: 0,
    inTesting: 0,
    testPassed: 0,
    bugFound: 0,
    totalBugs: 0,
    resolvedBugs: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ready_for_testing');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [filteredTasks, setFilteredTasks] = useState([]);

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
        await fetchTesterBoard(projectId, sprintId);
      } else {
        await Promise.all([
          fetchTasksToTest(),
          fetchProjects(),
          fetchTesterStats()
        ]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasksToTest = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/tester/tasks`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      } else {
        console.error('Failed to fetch tasks:', response.status);
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks to test:', error);
      setTasks([]);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/tester/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const projectsData = await response.json();
        setProjects(projectsData);
      } else {
        console.error('Failed to fetch projects:', response.status);
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  const fetchTesterStats = async () => {
    try {
      const token = localStorage.getItem('token');

      const tasksResponse = await fetch(`http://localhost:8080/api/tester/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (tasksResponse.ok) {
        const statsData = await tasksResponse.json();
        setStats(statsData);
      } else {
        console.error('Failed to fetch stats:', tasksResponse.status);
        setStats({
          totalTasks: 0,
          readyForTesting: 0,
          inTesting: 0,
          testPassed: 0,
          bugFound: 0,
          totalBugs: 0,
          resolvedBugs: 0
        });
      }
    } catch (error) {
      console.error('Error fetching tester stats:', error);
      setStats({
        totalTasks: 0,
        readyForTesting: 0,
        inTesting: 0,
        testPassed: 0,
        bugFound: 0,
        totalBugs: 0,
        resolvedBugs: 0
      });
    }
  };

  const fetchTesterBoard = async (projectId, sprintId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/tester/board?projectId=${projectId}&sprintId=${sprintId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setBoardData(data);
      } else {
        console.error('Failed to fetch board data:', response.status);
        setBoardData(null);
      }
    } catch (error) {
      console.error('Error fetching tester board:', error);
      setBoardData(null);
    }
  };


  const calculateTesterStats = (tasksData) => {
    const stats = {
      totalTasks: tasksData.length,
      readyForTesting: tasksData.filter(t => t.status === 'READY_FOR_TESTING').length,
      inTesting: tasksData.filter(t => t.status === 'IN_TESTING').length,
      testPassed: tasksData.filter(t => t.status === 'TEST_PASSED').length,
      bugFound: tasksData.filter(t => t.status === 'BUG_FOUND').length,
      totalBugs: 0,
      resolvedBugs: 0
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
      const statusMap = {
        'ready_for_testing': 'READY_FOR_TESTING',
        'in_testing': 'IN_TESTING',
        'test_passed': 'TEST_PASSED',
        'bug_found': 'BUG_FOUND'
      };
      filtered = filtered.filter(task => task.status === statusMap[statusFilter]);
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
      const response = await fetch(`http://localhost:8080/api/tester/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchData();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleReportBug = (task) => {
    setSelectedTask(task);
    setShowBugModal(true);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'tasks':
        return (
          <TasksToTest
            filteredTasks={filteredTasks}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            onTaskClick={handleTaskClick}
            onUpdateStatus={updateTaskStatus}
            onReportBug={handleReportBug}
          />
        );
      case 'board':
        return (
          <TesterBoard
            boardData={boardData}
            projectId={projectId}
            sprintId={sprintId}
            onTaskClick={handleTaskClick}
            onUpdateStatus={updateTaskStatus}
            onReportBug={handleReportBug}
            navigate={navigate}
          />
        );
      default:
        return (
          <TesterDashboard
            stats={stats}
            projects={projects}
            tasks={tasks}
            onTaskClick={handleTaskClick}
            onUpdateStatus={updateTaskStatus}
            onReportBug={handleReportBug}
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
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-dark"></div>
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
            Quality Assurance Testing Workspace
          </p>
        </div>

        {renderContent()}

        <TaskTestModal
          showModal={showTaskModal}
          task={selectedTask}
          onClose={() => setShowTaskModal(false)}
          onUpdateStatus={updateTaskStatus}
          onReportBug={handleReportBug}
        />

        <BugReportModal
          showModal={showBugModal}
          task={selectedTask}
          onClose={() => setShowBugModal(false)}
          onSubmit={() => {
            setShowBugModal(false);
            fetchData();
          }}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Tester;