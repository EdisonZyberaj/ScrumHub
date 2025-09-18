import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Calendar,
    Target,
    Plus,
    Play,
    CheckCircle,
    Clock,
    Users,
    BarChart3,
    ArrowRight,
    Edit,
    UserCheck,
    FolderOpen
} from 'lucide-react';
import CreateSprintModal from './CreateSprintModal';
import SprintDetailModal from './SprintDetailModal';
import Navbar from '../../shared/Navbar';
import Footer from '../../shared/Footer';

const SprintPlanning = () => {
    const navigate = useNavigate();
    const [sprints, setSprints] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSprintDetailModal, setShowSprintDetailModal] = useState(false);
    const [selectedSprint, setSelectedSprint] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [activeSprint, setActiveSprint] = useState(null);

    useEffect(() => {
        fetchData();
    }, [selectedProject]);

    useEffect(() => {
        if (selectedProject) {
            fetchSprintsForProject(selectedProject);
        }
    }, [selectedProject]);

    const fetchSprintsForProject = async (projectId) => {
        if (!projectId) return;
        
        try {
            const token = localStorage.getItem('token');
            const sprintsResponse = await fetch(`http:
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (sprintsResponse.ok) {
                const sprintsData = await sprintsResponse.json();
                setSprints(sprintsData);
                setActiveSprint(sprintsData.find(s => s.status === 'ACTIVE'));
            } else {
                console.error('Failed to fetch sprints:', sprintsResponse.status);
                const mockSprints = [
                    {
                        id: `mock-${projectId}-1`,
                        name: `Sprint 1 - ${projectId === 1 ? 'User Authentication' : 'Core Features'}`,
                        goal: `Implement basic ${projectId === 1 ? 'authentication system' : 'functionality'}`,
                        startDate: '2025-01-01T00:00:00',
                        endDate: '2025-01-15T23:59:59',
                        status: 'COMPLETED',
                        active: false,
                        totalTasks: 8,
                        completedTasks: 8,
                        progress: 100,
                        projectId: projectId
                    },
                    {
                        id: `mock-${projectId}-2`,
                        name: `Sprint 2 - ${projectId === 1 ? 'Product Catalog' : 'Advanced Features'}`,
                        goal: `Develop ${projectId === 1 ? 'product catalog' : 'advanced features'}`,
                        startDate: '2025-01-16T00:00:00',
                        endDate: '2025-01-30T23:59:59',
                        status: 'ACTIVE',
                        active: true,
                        totalTasks: 12,
                        completedTasks: 7,
                        progress: 58,
                        projectId: projectId
                    }
                ];
                setSprints(mockSprints);
                setActiveSprint(mockSprints.find(s => s.active));
            }
        } catch (sprintError) {
            console.error('Error fetching sprints:', sprintError);
            setSprints([]);
            setActiveSprint(null);
        }
    };

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            
            const projectsResponse = await fetch('http:
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (projectsResponse.ok) {
                const projectsData = await projectsResponse.json();
                setProjects(projectsData);
                if (!selectedProject && projectsData.length > 0) {
                    setSelectedProject(projectsData[0].id);
                }
            } else {
                const mockProjects = [
                    { 
                        id: 1, 
                        name: 'E-commerce Platform', 
                        key: 'ECOM',
                        description: 'Online shopping platform',
                        startDate: '2025-01-01',
                        endDate: '2025-12-31'
                    },
                    { 
                        id: 2, 
                        name: 'Mobile Banking App', 
                        key: 'MBA',
                        description: 'Mobile banking application',
                        startDate: '2025-02-01',
                        endDate: '2025-11-30'
                    }
                ];
                setProjects(mockProjects);
                if (!selectedProject) {
                    setSelectedProject(mockProjects[0].id);
                }
            }

            if (selectedProject) {
                try {
                    const sprintsResponse = await fetch(`http:
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    if (sprintsResponse.ok) {
                        const sprintsData = await sprintsResponse.json();
                        setSprints(sprintsData);
                        setActiveSprint(sprintsData.find(s => s.status === 'ACTIVE'));
                    } else {
                        console.error('Failed to fetch sprints:', sprintsResponse.status);
                        const mockSprints = [
                            {
                                id: 1,
                                name: `Sprint 1 - ${selectedProject === 1 ? 'User Authentication' : 'Core Features'}`,
                                goal: `Implement basic ${selectedProject === 1 ? 'authentication system' : 'functionality'}`,
                                startDate: '2025-01-01T00:00:00',
                                endDate: '2025-01-15T23:59:59',
                                status: 'COMPLETED',
                                active: false,
                                totalTasks: 8,
                                completedTasks: 8,
                                progress: 100,
                                projectId: selectedProject
                            },
                            {
                                id: 2,
                                name: `Sprint 2 - ${selectedProject === 1 ? 'Product Catalog' : 'Advanced Features'}`,
                                goal: `Develop ${selectedProject === 1 ? 'product catalog' : 'advanced features'}`,
                                startDate: '2025-01-16T00:00:00',
                                endDate: '2025-01-30T23:59:59',
                                status: 'ACTIVE',
                                active: true,
                                totalTasks: 12,
                                completedTasks: 7,
                                progress: 58,
                                projectId: selectedProject
                            }
                        ];
                        setSprints(mockSprints);
                        setActiveSprint(mockSprints.find(s => s.active));
                    }
                } catch (sprintError) {
                    console.error('Error fetching sprints:', sprintError);
                    setSprints([]);
                    setActiveSprint(null);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setIsLoading(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysRemaining = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const handleCreateSprint = async (sprintData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http:
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    ...sprintData, 
                    projectId: selectedProject
                })
            });

            if (response.ok) {
                const newSprint = await response.json();
                setSprints(prev => [newSprint, ...prev]);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create sprint');
            }
        } catch (error) {
            console.error('Error creating sprint:', error);
            throw error;
        }
    };

    const handleStartSprint = async (sprintId) => {
        try {
            const token = localStorage.getItem('token');
            
            if (activeSprint && activeSprint.id !== sprintId) {
                await fetch(`http:
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ active: false })
                });
            }

            const response = await fetch(`http:
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ active: true })
            });

            if (response.ok) {
                const updatedSprint = await response.json();
                setSprints(prev => prev.map(s => 
                    s.id === sprintId 
                        ? { ...s, ...updatedSprint }
                        : { ...s, active: false, status: 'PLANNED' }
                ));
                setActiveSprint(updatedSprint);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to start sprint');
            }
        } catch (error) {
            console.error('Error starting sprint:', error);
            throw error;
        }
    };

    const handleSprintClick = (sprint) => {
        setSelectedSprint(sprint);
        setShowSprintDetailModal(true);
    };

    const handleUpdateSprintStatus = async (sprintId, isActive) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http:
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ active: isActive })
            });

            if (response.ok) {
                const updatedSprint = await response.json();
                
                setSprints(prevSprints => {
                    return prevSprints.map(sprint => {
                        if (sprint.id === sprintId) {
                            return { ...sprint, ...updatedSprint };
                        } else if (isActive) {
                            return { ...sprint, active: false, status: 'PLANNED' };
                        }
                        return sprint;
                    });
                });

                if (isActive) {
                    setActiveSprint(updatedSprint);
                } else {
                    setActiveSprint(null);
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update sprint status');
            }
        } catch (error) {
            console.error('Error updating sprint status:', error);
            throw error;
        }
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
                        Sprint Planning
                    </h1>
                    <p className="text-gray-600">
                        Create and manage sprints for your project
                    </p>
                </div>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 md:mt-0 bg-primary text-white px-4 py-2 rounded-lg hover:bg-hoverBlue transition flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Sprint
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

            {/* Project Selector */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
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
            </div>

            {/* Active Sprint Overview */}
            {activeSprint && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                            <h2 className="text-xl font-bold text-gray-800">Active Sprint</h2>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 bg-green-100 text-green-800">
                            <Play className="h-4 w-4" />
                            Active
                        </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{activeSprint.name}</h3>
                    <p className="text-gray-600 mb-4">{activeSprint.goal}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{activeSprint.progress || 0}%</div>
                            <div className="text-sm text-gray-600">Completed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">{activeSprint.completedTasks || 0}/{activeSprint.totalTasks || 0}</div>
                            <div className="text-sm text-gray-600">Tasks</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{getDaysRemaining(activeSprint.endDate)}</div>
                            <div className="text-sm text-gray-600">Days Left</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">14</div>
                            <div className="text-sm text-gray-600">Sprint Days</div>
                        </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                        <div 
                            className="bg-primary h-3 rounded-full transition-all duration-500" 
                            style={{ width: `${activeSprint.progress || 0}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-500">
                        <span>{formatDate(activeSprint.startDate)} - {formatDate(activeSprint.endDate)}</span>
                        <button className="text-primary hover:text-hoverBlue font-medium flex items-center">
                            View Sprint Board <ArrowRight className="h-4 w-4 ml-1" />
                        </button>
                    </div>
                </div>
            )}

            {/* Sprints List */}
            <div className="space-y-4">
                {sprints.map((sprint) => (
                    <div 
                        key={sprint.id} 
                        className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleSprintClick(sprint)}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-1">{sprint.name}</h3>
                                <p className="text-gray-600">{sprint.goal}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                                    sprint.status === 'ACTIVE'
                                        ? 'bg-green-100 text-green-800' 
                                        : sprint.status === 'COMPLETED'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {sprint.status === 'ACTIVE' ? <Play className="h-4 w-4" /> : 
                                     sprint.status === 'COMPLETED' ? <CheckCircle className="h-4 w-4" /> :
                                     <Clock className="h-4 w-4" />}
                                    {sprint.status === 'ACTIVE' ? 'Active' : 
                                     sprint.status === 'COMPLETED' ? 'Completed' : 'Planned'}
                                </span>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <Edit className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-2" />
                                {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <Target className="h-4 w-4 mr-2" />
                                {sprint.completedTasks || 0}/{sprint.totalTasks || 0} tasks
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                {sprint.progress || 0}% complete
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-2" />
                                {sprint.status === 'ACTIVE'
                                    ? `${getDaysRemaining(sprint.endDate)} days left`
                                    : sprint.status === 'COMPLETED'
                                        ? 'Completed'
                                        : 'Not started'
                                }
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${sprint.progress || 0}%` }}
                            ></div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                Sprint {sprint.id} • {formatDate(sprint.startDate)}
                            </div>

                            <div className="flex gap-2">
                                {sprint.status === 'PLANNED' && (
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStartSprint(sprint.id);
                                        }}
                                        className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm hover:bg-green-200 transition flex items-center"
                                    >
                                        <Play className="h-4 w-4 mr-1" />
                                        Start Sprint
                                    </button>
                                )}
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSprintClick(sprint);
                                    }}
                                    className="text-primary hover:bg-primary hover:text-white border border-primary px-3 py-1 rounded-lg text-sm transition"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {sprints.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <Target className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sprints yet</h3>
                    <p className="text-gray-500 mb-4">
                        Get started by creating your first sprint
                    </p>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-hoverBlue transition"
                    >
                        Create First Sprint
                    </button>
                </div>
            )}

            {/* Create Sprint Modal */}
            <CreateSprintModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateSprint}
                projects={projects}
                selectedProject={selectedProject}
            />

            {/* Sprint Detail Modal */}
            <SprintDetailModal
                isOpen={showSprintDetailModal}
                onClose={() => {
                    setShowSprintDetailModal(false);
                    setSelectedSprint(null);
                }}
                sprint={selectedSprint}
                onUpdateSprint={handleUpdateSprintStatus}
            />
            </div>
            <Footer />
        </div>
    );
};

export default SprintPlanning;