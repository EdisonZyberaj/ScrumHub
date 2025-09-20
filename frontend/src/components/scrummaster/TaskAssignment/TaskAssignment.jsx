import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
    UserCheck, 
    Plus, 
    Search, 
    Filter, 
    Clock,
    AlertCircle,
    CheckCircle,
    Users,
    Target,
    Calendar,
    Edit,
    Trash2,
    User,
    FolderOpen,
    BarChart3
} from 'lucide-react';
import CreateTaskModal from './CreateTaskModal';
import AssignTaskModal from './AssignTaskModal';
import Navbar from '../../shared/Navbar';
import Footer from '../../shared/Footer';

const TaskAssignment = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [tasks, setTasks] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedSprint, setSelectedSprint] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterAssignee, setFilterAssignee] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [selectedProject, selectedSprint]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            
            const projectsResponse = await fetch('http://localhost:8080/api/projects', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (projectsResponse.ok) {
                const projectsData = await projectsResponse.json();
                setProjects(projectsData);
                if (!selectedProject && projectsData.length > 0) {
                    setSelectedProject(projectsData[0].id);
                }
            } else {
                console.error('Failed to fetch projects:', projectsResponse.status);
                setProjects([]);
            }

            if (selectedProject) {
                const sprintsResponse = await fetch(`http://localhost:8080/api/sprints?projectId=${selectedProject}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (sprintsResponse.ok) {
                    const sprintsData = await sprintsResponse.json();
                    setSprints(sprintsData);
                    const activeSprint = sprintsData.find(s => s.active);
                    if (activeSprint && !selectedSprint) {
                        setSelectedSprint(activeSprint.id);
                    }
                } else {
                    console.error('Failed to fetch sprints:', sprintsResponse.status);
                    setSprints([]);
                }
            }

            const membersResponse = await fetch('http://localhost:8080/api/users?role=DEVELOPER,TESTER', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (membersResponse.ok) {
                const membersData = await membersResponse.json();
                setTeamMembers(membersData);
            } else {
                console.error('Failed to fetch team members:', membersResponse.status);
                setTeamMembers([]);
            }

            if (selectedSprint) {
                const tasksResponse = await fetch(`http://localhost:8080/api/tasks?sprintId=${selectedSprint}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (tasksResponse.ok) {
                    const tasksData = await tasksResponse.json();
                    setTasks(tasksData);
                } else {
                    console.error('Failed to fetch tasks:', tasksResponse.status);
                    setTasks([]);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setIsLoading(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'TO_DO':
                return 'bg-gray-100 text-gray-800';
            case 'IN_PROGRESS':
                return 'bg-blue-100 text-blue-800';
            case 'READY_FOR_TESTING':
                return 'bg-yellow-100 text-yellow-800';
            case 'DONE':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'LOW':
                return 'text-green-600';
            case 'MEDIUM':
                return 'text-yellow-600';
            case 'HIGH':
                return 'text-orange-600';
            case 'CRITICAL':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getWorkloadColor = (current, max) => {
        const percentage = (current / max) * 100;
        if (percentage <= 60) return 'text-green-600';
        if (percentage <= 80) return 'text-yellow-600';
        return 'text-red-600';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
        const matchesAssignee = filterAssignee === 'all' || 
                              (filterAssignee === 'unassigned' && !task.assigneeId) ||
                              (task.assigneeId && task.assigneeId.toString() === filterAssignee);
        
        return matchesSearch && matchesStatus && matchesAssignee;
    });

    const handleCreateTask = async (taskData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...taskData,
                    sprintId: selectedSprint,
                    projectId: selectedProject,
                    status: 'TO_DO'
                })
            });

            if (response.ok) {
                const newTask = await response.json();
                setTasks(prev => [newTask, ...prev]);
            } else {
                throw new Error('Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            const newTask = {
                id: Date.now(),
                ...taskData,
                sprintId: selectedSprint,
                projectId: selectedProject,
                status: 'TO_DO',
                assignee: null
            };
            setTasks(prev => [newTask, ...prev]);
        }
    };

    const handleAssignTask = async (taskId, assigneeId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/tasks/${taskId}/assign`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ assigneeId })
            });

            if (response.ok) {
                const updatedTask = await response.json();
                setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
            } else {
                throw new Error('Failed to assign task');
            }
        } catch (error) {
            console.error('Error assigning task:', error);
            const assignee = teamMembers.find(m => m.id === assigneeId);
            setTasks(prev => prev.map(t => 
                t.id === taskId 
                    ? { ...t, assigneeId, assignee }
                    : t
            ));
        }
    };

    const handleUnassignTask = async (taskId) => {
        await handleAssignTask(taskId, null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex-grow p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Task Assignment
                    </h1>
                    <p className="text-gray-600">
                        Manage and assign tasks to your team members
                    </p>
                </div>
                <button 
                    onClick={() => setShowCreateTaskModal(true)}
                    className="mt-4 md:mt-0 bg-primary text-white px-4 py-2 rounded-lg hover:bg-hoverBlue transition flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                </button>
            </div>

            {/* Quick Navigation */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => navigate('/scrummaster')}
                        className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                    >
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Projects
                    </button>
                    <button
                        onClick={() => navigate('/scrummaster/sprint-planning')}
                        className="flex items-center px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition"
                    >
                        <Target className="h-4 w-4 mr-2" />
                        Sprint Planning
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition"
                    >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Dashboard
                    </button>
                </div>
            </div>

            {/* Project and Sprint Selectors */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700">Project:</label>
                        <select
                            value={selectedProject || ''}
                            onChange={(e) => setSelectedProject(parseInt(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name} ({project.key})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700">Sprint:</label>
                        <select
                            value={selectedSprint || ''}
                            onChange={(e) => setSelectedSprint(parseInt(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            {sprints.map(sprint => (
                                <option key={sprint.id} value={sprint.id}>
                                    {sprint.name} {sprint.active && '(Active)'}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Team Workload Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Team Workload</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {teamMembers.map(member => (
                        <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center mb-3">
                                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                                    {member.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div className="ml-3">
                                    <p className="font-medium text-gray-800">{member.fullName}</p>
                                    <p className="text-xs text-gray-500">{member.role}</p>
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Current Tasks</span>
                                    <span className={getWorkloadColor(member.currentTasks, member.maxCapacity)}>
                                        {member.currentTasks}/{member.maxCapacity}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            (member.currentTasks / member.maxCapacity) > 0.8 
                                                ? 'bg-red-500' 
                                                : (member.currentTasks / member.maxCapacity) > 0.6 
                                                    ? 'bg-yellow-500' 
                                                    : 'bg-green-500'
                                        }`}
                                        style={{ width: `${(member.currentTasks / member.maxCapacity) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">
                                {member.currentTasks === 0 ? 'Available' : 
                                 member.currentTasks >= member.maxCapacity ? 'At capacity' : 'Available'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="TO_DO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="READY_FOR_TESTING">Ready for Testing</option>
                            <option value="DONE">Done</option>
                        </select>
                        <select
                            value={filterAssignee}
                            onChange={(e) => setFilterAssignee(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="all">All Assignees</option>
                            <option value="unassigned">Unassigned</option>
                            {teamMembers.map(member => (
                                <option key={member.id} value={member.id}>
                                    {member.fullName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {filteredTasks.map(task => (
                    <div key={task.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
                                <p className="text-gray-600 mb-3">{task.description}</p>
                                
                                <div className="flex flex-wrap gap-3 text-sm">
                                    <span className={`px-2 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                    <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                                        {task.priority} Priority
                                    </span>
                                    <div className="flex items-center text-gray-500">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {task.estimatedHours}h estimated
                                    </div>
                                    <div className="flex items-center text-gray-500">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        Due {formatDate(task.dueDate)}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                                <button 
                                    onClick={() => {
                                        setSelectedTask(task);
                                        setShowAssignModal(true);
                                    }}
                                    className="text-primary hover:bg-primary hover:text-white border border-primary px-3 py-1 rounded-lg text-sm transition"
                                >
                                    <UserCheck className="h-4 w-4" />
                                </button>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <Edit className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div>
                                {task.assignee ? (
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                                            {task.assignee.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{task.assignee.fullName}</p>
                                            <p className="text-xs text-gray-500">{task.assignee.role}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleUnassignTask(task.id)}
                                            className="ml-3 text-xs text-red-600 hover:text-red-800"
                                        >
                                            Unassign
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center text-gray-400">
                                        <User className="h-8 w-8 mr-3" />
                                        <span className="text-sm">Unassigned</span>
                                        <button 
                                            onClick={() => {
                                                setSelectedTask(task);
                                                setShowAssignModal(true);
                                            }}
                                            className="ml-3 text-xs text-primary hover:text-hoverBlue"
                                        >
                                            Assign now
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Task #{task.id}</p>
                                {new Date(task.dueDate) < new Date() && task.status !== 'DONE' && (
                                    <p className="text-xs text-red-600 flex items-center">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        Overdue
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredTasks.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <Target className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm || filterStatus !== 'all' || filterAssignee !== 'all'
                            ? 'Try adjusting your search or filter criteria'
                            : 'Create your first task to get started'
                        }
                    </p>
                    {!searchTerm && filterStatus === 'all' && filterAssignee === 'all' && (
                        <button 
                            onClick={() => setShowCreateTaskModal(true)}
                            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-hoverBlue transition"
                        >
                            Create First Task
                        </button>
                    )}
                </div>
            )}

            {/* Create Task Modal */}
            <CreateTaskModal
                isOpen={showCreateTaskModal}
                onClose={() => setShowCreateTaskModal(false)}
                onSubmit={handleCreateTask}
                projects={projects}
                sprints={sprints}
                selectedProject={selectedProject}
                selectedSprint={selectedSprint}
                preSelectedStatus={searchParams.get('status')}
            />

            {/* Assign Task Modal */}
            <AssignTaskModal
                isOpen={showAssignModal}
                onClose={() => {
                    setShowAssignModal(false);
                    setSelectedTask(null);
                }}
                task={selectedTask}
                teamMembers={teamMembers}
                onAssign={handleAssignTask}
            />
            </div>
            <Footer />
        </div>
    );
};

export default TaskAssignment;