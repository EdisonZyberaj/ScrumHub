import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    CheckCircle,
    Clock,
    AlertCircle,
    Target,
    ArrowUp,
    ArrowDown,
    ChevronRight,
    Layers,
    BarChart3,
    Calendar,
    Users
} from 'lucide-react';
import CreateBacklogItemModal from './CreateBacklogItemModal';
import EditBacklogItemModal from './EditBacklogItemModal';
import CreateEpicModal from './CreateEpicModal';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

const ProductBacklog = () => {
    const navigate = useNavigate();
    const [backlogItems, setBacklogItems] = useState([]);
    const [epics, setEpics] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [selectedEpic, setSelectedEpic] = useState('ALL');
    const [statistics, setStatistics] = useState({});

    const [showCreateItemModal, setShowCreateItemModal] = useState(false);
    const [showEditItemModal, setShowEditItemModal] = useState(false);
    const [showCreateEpicModal, setShowCreateEpicModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchData();
    }, [selectedProject]);

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
                await Promise.all([
                    fetchBacklogItems(selectedProject),
                    fetchEpics(selectedProject),
                    fetchStatistics(selectedProject)
                ]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setIsLoading(false);
    };

    const fetchBacklogItems = async (projectId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/product-owner/projects/${projectId}/backlog`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setBacklogItems(data);
            } else {
                console.error('Failed to fetch backlog items:', response.status);
                setBacklogItems([]);
            }
        } catch (error) {
            console.error('Error fetching backlog items:', error);
            setBacklogItems([]);
        }
    };

    const fetchEpics = async (projectId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/product-owner/projects/${projectId}/epics`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setEpics(data);
            } else {
                console.error('Failed to fetch epics:', response.status);
                setEpics([]);
            }
        } catch (error) {
            console.error('Error fetching epics:', error);
            setEpics([]);
        }
    };

    const fetchStatistics = async (projectId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/product-owner/projects/${projectId}/backlog/statistics`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setStatistics(data);
            } else {
                console.error('Failed to fetch statistics:', response.status);
                setStatistics({});
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
            setStatistics({});
        }
    };

    const handleCreateItem = async (itemData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/product-owner/projects/${selectedProject}/backlog`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(itemData)
            });

            if (response.ok) {
                const newItem = await response.json();
                setBacklogItems(prev => [newItem, ...prev]);
                await fetchStatistics(selectedProject);
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to create backlog item (${response.status})`);
            }
        } catch (error) {
            console.error('Error creating backlog item:', error);


            throw error;
        }
    };

    const handleEditItem = async (itemId, itemData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/product-owner/backlog/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(itemData)
            });

            if (response.ok) {
                const updatedItem = await response.json();
                setBacklogItems(prev => prev.map(item =>
                    item.id === itemId ? updatedItem : item
                ));
                await fetchStatistics(selectedProject);
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to update backlog item (${response.status})`);
            }
        } catch (error) {
            console.error('Error updating backlog item:', error);


            throw error;
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this backlog item?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/product-owner/backlog/${itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setBacklogItems(prev => prev.filter(item => item.id !== itemId));
                await fetchStatistics(selectedProject);
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to delete backlog item (${response.status})`);
            }
        } catch (error) {
            console.error('Error deleting backlog item:', error);


            alert('Failed to delete backlog item: ' + error.message);
        }
    };

    const handleReorderItems = async (draggedItem, targetPosition) => {
        const reorderedItems = [...backlogItems];
        const draggedIndex = reorderedItems.findIndex(item => item.id === draggedItem.id);
        reorderedItems.splice(draggedIndex, 1);
        reorderedItems.splice(targetPosition, 0, draggedItem);

        setBacklogItems(reorderedItems);

        try {
            const token = localStorage.getItem('token');
            const itemIdsInOrder = reorderedItems.map(item => item.id);

            const response = await fetch(`http://localhost:8080/api/product-owner/projects/${selectedProject}/backlog/reorder`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ itemIdsInOrder })
            });

            if (!response.ok) {
                await fetchBacklogItems(selectedProject);
                throw new Error('Failed to reorder items');
            }
        } catch (error) {
            console.error('Error reordering items:', error);
            alert('Failed to reorder items');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'NEW': return 'bg-gray-100 text-gray-800';
            case 'READY': return 'bg-green-100 text-green-800';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
            case 'IN_SPRINT': return 'bg-purple-100 text-purple-800';
            case 'DONE': return 'bg-emerald-100 text-emerald-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'CRITICAL': return 'text-red-600';
            case 'HIGH': return 'text-orange-600';
            case 'MEDIUM': return 'text-yellow-600';
            case 'LOW': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'USER_STORY': return <Users className="h-4 w-4" />;
            case 'FEATURE': return <Layers className="h-4 w-4" />;
            case 'BUG': return <AlertCircle className="h-4 w-4" />;
            case 'TECHNICAL_DEBT': return <Target className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    const filteredItems = backlogItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
        const matchesEpic = selectedEpic === 'ALL' ||
                           (selectedEpic === 'NONE' && !item.epic) ||
                           (item.epic && item.epic.id.toString() === selectedEpic);

        return matchesSearch && matchesStatus && matchesEpic;
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
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Product Backlog
                        </h1>
                        <p className="text-gray-600">
                            Manage and prioritize your product backlog items
                        </p>
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                        <button
                            onClick={() => setShowCreateEpicModal(true)}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center"
                        >
                            <Layers className="h-4 w-4 mr-2" />
                            Create Epic
                        </button>
                        <button
                            onClick={() => setShowCreateItemModal(true)}
                            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-hoverBlue transition flex items-center"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Story
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

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="text-2xl font-bold text-primary">{statistics.totalItems || 0}</div>
                        <div className="text-sm text-gray-600">Total Items</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="text-2xl font-bold text-green-600">{statistics.readyItems || 0}</div>
                        <div className="text-sm text-gray-600">Ready</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="text-2xl font-bold text-blue-600">{statistics.newItems || 0}</div>
                        <div className="text-sm text-gray-600">New</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="text-2xl font-bold text-purple-600">{statistics.completedItems || 0}</div>
                        <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="text-2xl font-bold text-orange-600">{statistics.totalStoryPoints || 0}</div>
                        <div className="text-sm text-gray-600">Story Points</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search backlog items..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="ALL">All Status</option>
                            <option value="NEW">New</option>
                            <option value="READY">Ready</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="IN_SPRINT">In Sprint</option>
                            <option value="DONE">Done</option>
                        </select>
                        <select
                            value={selectedEpic}
                            onChange={(e) => setSelectedEpic(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="ALL">All Epics</option>
                            <option value="NONE">No Epic</option>
                            {epics.map(epic => (
                                <option key={epic.id} value={epic.id.toString()}>
                                    {epic.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Backlog Items */}
                <div className="space-y-3">
                    {filteredItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border-l-4 border-primary"
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', JSON.stringify(item));
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const draggedItem = JSON.parse(e.dataTransfer.getData('text/plain'));
                                handleReorderItems(draggedItem, index);
                            }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(item.type)}
                                            <span className="text-sm font-medium text-gray-600">{item.type}</span>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                        <span className={`text-sm font-medium ${getPriorityColor(item.priority)}`}>
                                            {item.priority}
                                        </span>
                                        {item.storyPoints && (
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                                {item.storyPoints} pts
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
                                    <p className="text-gray-600 mb-2">{item.description}</p>
                                    {item.epic && (
                                        <div className="flex items-center gap-2 mb-2">
                                            <Layers className="h-3 w-3 text-purple-600" />
                                            <span className="text-sm text-purple-600">{item.epic.title}</span>
                                        </div>
                                    )}
                                    {item.acceptanceCriteria && (
                                        <div className="mt-2">
                                            <span className="text-sm font-medium text-gray-700">Acceptance Criteria:</span>
                                            <p className="text-sm text-gray-600 mt-1">{item.acceptanceCriteria}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedItem(item);
                                            setShowEditItemModal(true);
                                        }}
                                        className="text-gray-400 hover:text-blue-600 transition"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="text-gray-400 hover:text-red-600 transition"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Target className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No backlog items found</h3>
                        <p className="text-gray-500 mb-4">
                            {searchTerm || filterStatus !== 'ALL' || selectedEpic !== 'ALL'
                                ? 'Try adjusting your filters'
                                : 'Get started by creating your first backlog item'
                            }
                        </p>
                        {(!searchTerm && filterStatus === 'ALL' && selectedEpic === 'ALL') && (
                            <button
                                onClick={() => setShowCreateItemModal(true)}
                                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-hoverBlue transition"
                            >
                                Create First Item
                            </button>
                        )}
                    </div>
                )}

                {/* Modals */}
                <CreateBacklogItemModal
                    isOpen={showCreateItemModal}
                    onClose={() => setShowCreateItemModal(false)}
                    onSubmit={handleCreateItem}
                    epics={epics}
                />

                <EditBacklogItemModal
                    isOpen={showEditItemModal}
                    onClose={() => {
                        setShowEditItemModal(false);
                        setSelectedItem(null);
                    }}
                    onSubmit={handleEditItem}
                    item={selectedItem}
                    epics={epics}
                />

                <CreateEpicModal
                    isOpen={showCreateEpicModal}
                    onClose={() => setShowCreateEpicModal(false)}
                    onSubmit={async (epicData) => {
                        try {
                            const token = localStorage.getItem('token');
                            const response = await fetch(`http://localhost:8080/api/product-owner/projects/${selectedProject}/epics`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify(epicData)
                            });

                            if (response.ok) {
                                const newEpic = await response.json();
                                setEpics(prev => [newEpic, ...prev]);
                            } else {
                                throw new Error('Failed to create epic');
                            }
                        } catch (error) {
                            console.error('Error creating epic:', error);
                            throw error;
                        }
                    }}
                />
            </div>
            <Footer />
        </div>
    );
};

export default ProductBacklog;