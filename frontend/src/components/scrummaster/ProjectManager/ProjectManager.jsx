import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Calendar,
    Users,
    BarChart3,
    Settings,
    Search,
    Filter,
    MoreHorizontal,
    Clock,
    CheckCircle,
    AlertCircle,
    Target,
    UserCheck,
    ChevronDown
} from 'lucide-react';
import CreateProjectModal from './CreateProjectModal';
import Navbar from '../../shared/Navbar';
import Footer from '../../shared/Footer';

const ProjectManager = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [openDropdown, setOpenDropdown] = useState(null);

    // Fetch real data from backend API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No authentication token found');
                    setProjects([]);
                    setIsLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:8080/api/projects', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch projects: ${response.status}`);
                }
                const projectsData = await response.json();
                setProjects(projectsData);
            } catch (error) {
                console.error('Error fetching projects:', error);
                // Fallback to empty array on error
                setProjects([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdown(null);
        if (openDropdown) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [openDropdown]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getProgressPercentage = (completed, total) => {
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'on-hold':
                return 'bg-yellow-100 text-yellow-800';
            case 'planned':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
                return <Clock className="h-4 w-4" />;
            case 'completed':
                return <CheckCircle className="h-4 w-4" />;
            case 'on-hold':
                return <AlertCircle className="h-4 w-4" />;
            case 'planned':
                return <Target className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const handleCreateProject = async (projectData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(projectData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create project');
            }

            const newProject = await response.json();
            setProjects(prev => [newProject, ...prev]);
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    };

    const handleStatusChange = async (projectId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/projects/${projectId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                const updatedProject = await response.json();
                setProjects(prev => prev.map(p => 
                    p.id === projectId ? { ...p, status: newStatus } : p
                ));
            } else {
                throw new Error('Failed to update project status');
            }
        } catch (error) {
            console.error('Error updating project status:', error);
            // Mock update for demo
            setProjects(prev => prev.map(p => 
                p.id === projectId ? { ...p, status: newStatus } : p
            ));
        }
        setOpenDropdown(null);
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.key.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
        
        return matchesSearch && matchesFilter;
    });

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
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Project Management</h1>
                    <p className="text-gray-600">Manage and monitor all your projects</p>
                </div>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 md:mt-0 bg-primary text-white px-4 py-2 rounded-lg hover:bg-hoverBlue transition flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                </button>
            </div>

            {/* Quick Navigation */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => navigate('/scrummaster/sprint-planning')}
                        className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                    >
                        <Target className="h-4 w-4 mr-2" />
                        Sprint Planning
                    </button>
                    <button
                        onClick={() => navigate('/scrummaster/task-assignment')}
                        className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
                    >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Task Assignment
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

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search projects..."
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
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="on-hold">On Hold</option>
                            <option value="planned">Planned</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <div key={project.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                        {/* Project Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                    {project.name}
                                </h3>
                                <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {project.key}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(project.status)}`}>
                                    {getStatusIcon(project.status)}
                                    {project.status}
                                </span>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Project Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {project.description}
                        </p>

                        {/* Project Stats */}
                        <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center text-gray-600">
                                    <Users className="h-4 w-4 mr-2" />
                                    {project.memberCount} members
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    {project.sprintCount} sprints
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div>
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Progress</span>
                                    <span>{getProgressPercentage(project.completedTasks, project.totalTasks)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                                        style={{ width: `${getProgressPercentage(project.completedTasks, project.totalTasks)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>{project.completedTasks} completed</span>
                                    <span>{project.totalTasks} total tasks</span>
                                </div>
                            </div>
                        </div>

                        {/* Project Dates */}
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                            <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(project.startDate)}
                            </div>
                            <div>
                                Due: {formatDate(project.endDate)}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4">
                            <button 
                                onClick={() => navigate(`/scrummaster/project/${project.id}`)}
                                className="flex-1 text-primary hover:bg-primary hover:text-white border border-primary px-3 py-2 rounded-lg text-sm transition group"
                                title="Access both Scrum and Testing boards for comprehensive project management"
                            >
                                <span>View Project Boards</span>
                                <div className="text-xs text-primary group-hover:text-white mt-1 opacity-75">
                                    Scrum & Testing Views
                                </div>
                            </button>
                            <div className="relative">
                                <button 
                                    onClick={() => setOpenDropdown(openDropdown === project.id ? null : project.id)}
                                    className="px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-lg text-sm transition flex items-center"
                                >
                                    <Settings className="h-4 w-4 mr-1" />
                                    <ChevronDown className="h-3 w-3" />
                                </button>
                                
                                {openDropdown === project.id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                        <div className="py-1">
                                            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Change Status</div>
                                            <button
                                                onClick={() => handleStatusChange(project.id, 'active')}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center ${
                                                    project.status === 'active' ? 'text-green-600 font-medium' : 'text-gray-700'
                                                }`}
                                            >
                                                <Clock className="h-4 w-4 mr-2" />
                                                Active
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(project.id, 'completed')}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center ${
                                                    project.status === 'completed' ? 'text-blue-600 font-medium' : 'text-gray-700'
                                                }`}
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Completed
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(project.id, 'on-hold')}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center ${
                                                    project.status === 'on-hold' ? 'text-yellow-600 font-medium' : 'text-gray-700'
                                                }`}
                                            >
                                                <AlertCircle className="h-4 w-4 mr-2" />
                                                On Hold
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(project.id, 'planned')}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center ${
                                                    project.status === 'planned' ? 'text-purple-600 font-medium' : 'text-gray-700'
                                                }`}
                                            >
                                                <Target className="h-4 w-4 mr-2" />
                                                Planned
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <BarChart3 className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm || filterStatus !== 'all' 
                            ? 'Try adjusting your search or filter criteria'
                            : 'Get started by creating your first project'
                        }
                    </p>
                    {!searchTerm && filterStatus === 'all' && (
                        <button 
                            onClick={() => setShowCreateModal(true)}
                            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-hoverBlue transition"
                        >
                            Create Your First Project
                        </button>
                    )}
                </div>
            )}

            {/* Create Project Modal */}
            <CreateProjectModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateProject}
            />
            </div>
            <Footer />
        </div>
    );
};

export default ProjectManager;