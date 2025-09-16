import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import TesterDashboard from '../../components/tester/TesterDashboard';
import TasksToTest from '../../components/tester/TasksToTest';
import TesterBoard from '../../components/tester/TesterBoard';
import BugReports from '../../components/tester/BugReports';
import TestCases from '../../components/tester/TestCases';
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
  const [project, setProject] = useState(null);
  const [sprint, setSprint] = useState(null);
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

  // Filters for tasks view
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
    } else if (path.includes('/bugs')) {
      setCurrentView('bugs');
    } else if (path.includes('/testcases')) {
      setCurrentView('testcases');
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
      const token = localStorage.getItem('token');

      // For tester board view, we want to see all tasks in the project
      // not just assigned to the current user, so they can see the full workflow
      const userProjectsResponse = await fetch(`http://localhost:8080/api/projects?userId=${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (userProjectsResponse.ok) {
        const userProjects = await userProjectsResponse.json();

        // Get tasks from all projects the user is involved in
        let allTasks = [];
        for (const project of userProjects) {
          const projectTasksResponse = await fetch(`http://localhost:8080/api/tasks?projectId=${project.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (projectTasksResponse.ok) {
            const projectTasks = await projectTasksResponse.json();
            allTasks = [...allTasks, ...projectTasks];
          }
        }

        setTasks(allTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks to test:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/projects?userId=${user.id}`, {
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

  const fetchTesterStats = async () => {
    try {
      const token = localStorage.getItem('token');

      // Get all tasks to calculate stats
      const tasksResponse = await fetch(`http://localhost:8080/api/tasks?assigneeId=${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (tasksResponse.ok) {
        const allTasks = await tasksResponse.json();
        calculateTesterStats(allTasks);
      }
    } catch (error) {
      console.error('Error fetching tester stats:', error);
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
      }
    } catch (error) {
      console.error('Error fetching sprint:', error);
    }
  };

  const fetchSprintTasks = async (sprintId) => {
    try {
      const token = localStorage.getItem('token');

      // Fetch all tasks for the sprint (not just testing-specific ones)
      // since the tester board shows both dev and testing workflows
      const response = await fetch(`http://localhost:8080/api/tasks?sprintId=${sprintId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData); // Get all tasks, not just testing ones
      }
    } catch (error) {
      console.error('Error fetching sprint tasks:', error);
    }
  };

  const calculateTesterStats = (tasksData) => {
    const stats = {
      totalTasks: tasksData.length,
      readyForTesting: tasksData.filter(t => t.status === 'READY_FOR_TESTING').length,
      inTesting: tasksData.filter(t => t.status === 'IN_TESTING').length,
      testPassed: tasksData.filter(t => t.status === 'TEST_PASSED').length,
      bugFound: tasksData.filter(t => t.status === 'BUG_FOUND').length,
      totalBugs: 0, // This would come from bug reports API
      resolvedBugs: 0 // This would come from bug reports API
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
            project={project}
            sprint={sprint}
            tasks={tasks}
            navigate={navigate}
            onTaskClick={handleTaskClick}
            onUpdateStatus={updateTaskStatus}
            onReportBug={handleReportBug}
          />
        );
      case 'bugs':
        return <BugReports />;
      case 'testcases':
        return <TestCases />;
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
            fetchData(); // Refresh data after bug report
          }}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Tester;