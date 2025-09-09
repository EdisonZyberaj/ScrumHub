import React, { useState, useEffect } from 'react';
import {
    X,
    Users,
    Settings,
    Clock,
    CheckCircle,
    AlertCircle,
    Target,
    Plus,
    Trash2,
    UserCheck,
    Search
} from 'lucide-react';

const ProjectSettingsModal = ({ isOpen, onClose, project, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('members');
    const [projectMembers, setProjectMembers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRole, setSelectedRole] = useState('DEVELOPER');
    const [isLoading, setIsLoading] = useState(false);
    const [projectStatus, setProjectStatus] = useState(project?.status || 'active');

    // Fetch project members and available users
    useEffect(() => {
        if (isOpen && project && project.id) {
            fetchProjectMembers();
            fetchAvailableUsers();
            setProjectStatus(project.status || 'active');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, project]);

    const fetchProjectMembers = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/users?projectId=${project.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const members = await response.json();
                setProjectMembers(Array.isArray(members) ? members : []);
            } else {
                console.error('Failed to fetch project members:', response.status);
                setProjectMembers([]);
            }
        } catch (error) {
            console.error('Error fetching project members:', error);
            setProjectMembers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAvailableUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/users?role=DEVELOPER,TESTER', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const users = await response.json();
                setAvailableUsers(Array.isArray(users) ? users : []);
            } else {
                console.error('Failed to fetch available users:', response.status);
                setAvailableUsers([]);
            }
        } catch (error) {
            console.error('Error fetching available users:', error);
            setAvailableUsers([]);
        }
    };

    const handleAddMember = async () => {
        if (!selectedUser) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/projects/${project.id}/members`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: parseInt(selectedUser),
                    roleInProject: selectedRole
                })
            });

            if (response.ok) {
                await fetchProjectMembers();
                setSelectedUser('');
                setSelectedRole('DEVELOPER');
            } else {
                console.error('Failed to add member');
            }
        } catch (error) {
            console.error('Error adding member:', error);
        }
    };

    const handleRemoveMember = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/projects/${project.id}/members/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                await fetchProjectMembers();
            } else {
                console.error('Failed to remove member');
            }
        } catch (error) {
            console.error('Error removing member:', error);
        }
    };

    const handleStatusChange = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/projects/${project.id}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: projectStatus })
            });

            if (response.ok) {
                const updatedProject = await response.json();
                onUpdate(updatedProject);
                onClose();
            } else {
                console.error('Failed to update project status');
            }
        } catch (error) {
            console.error('Error updating project status:', error);
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

    const getRoleColor = (role) => {
        switch (role) {
            case 'SCRUM_MASTER':
                return 'bg-red-100 text-red-800';
            case 'DEVELOPER':
                return 'bg-blue-100 text-blue-800';
            case 'TESTER':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Filter available users to exclude those already in the project
    const filteredAvailableUsers = availableUsers
        .filter(user => !projectMembers.some(member => member.id === user.id))
        .filter(user => 
            (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

    if (!isOpen || !project || !project.id) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <Settings className="h-6 w-6 text-primary mr-3" />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Project Settings</h2>
                            <p className="text-gray-600 text-sm mt-1">{project.name} ({project.key})</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-2"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                    <div className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm ${
                                activeTab === 'members'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Users className="h-4 w-4 inline mr-2" />
                            Team Members
                        </button>
                        <button
                            onClick={() => setActiveTab('status')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm ${
                                activeTab === 'status'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Target className="h-4 w-4 inline mr-2" />
                            Project Status
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {activeTab === 'members' && (
                        <div className="space-y-6">
                            {/* Add Member Section */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Team Member</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-2">
                                        <label htmlFor="user-search" className="block text-sm font-medium text-gray-700 mb-2">
                                            Select User
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <input
                                                id="user-search"
                                                type="text"
                                                placeholder="Search users..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                        </div>
                                        <label htmlFor="user-select" className="sr-only">
                                            Select User from List
                                        </label>
                                        <select
                                            id="user-select"
                                            value={selectedUser}
                                            onChange={(e) => setSelectedUser(e.target.value)}
                                            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        >
                                            <option value="">Select a user...</option>
                                            {filteredAvailableUsers.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name || 'Unknown'} ({user.email || 'No email'})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mb-2">
                                            Role in Project
                                        </label>
                                        <select
                                            id="role-select"
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        >
                                            <option value="DEVELOPER">Developer</option>
                                            <option value="TESTER">Tester</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={handleAddMember}
                                            disabled={!selectedUser}
                                            className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-hoverBlue transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Member
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Current Members */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Current Team Members ({projectMembers.length})
                                </h3>
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                                    </div>
                                ) : projectMembers.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p>No team members assigned to this project.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {projectMembers.map((member) => (
                                            <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                                                        {(member.name || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="font-medium text-gray-800">{member.name || 'Unknown'}</div>
                                                        <div className="text-sm text-gray-600">{member.email || 'No email'}</div>
                                                        <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${getRoleColor(member.roleInProject || member.role)}`}>
                                                            {member.roleInProject || member.role}
                                                        </span>
                                                    </div>
                                                </div>
                                                {member.role !== 'SCRUM_MASTER' && (
                                                    <button
                                                        onClick={() => handleRemoveMember(member.id)}
                                                        className="text-red-600 hover:text-red-800 p-2"
                                                        title="Remove member"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'status' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Project Status</h3>
                                <p className="text-gray-600 mb-6">
                                    Update the current status of your project to reflect its current state.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['active', 'completed', 'on-hold', 'planned'].map((status) => (
                                        <div
                                            key={status}
                                            className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                                                projectStatus === status
                                                    ? 'border-primary bg-primary bg-opacity-5'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            onClick={() => setProjectStatus(status)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    {getStatusIcon(status)}
                                                    <span className="ml-2 font-medium text-gray-800 capitalize">
                                                        {status.replace('-', ' ')}
                                                    </span>
                                                </div>
                                                {projectStatus === status && (
                                                    <UserCheck className="h-5 w-5 text-primary" />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">
                                                {status === 'active' && 'Project is currently being worked on'}
                                                {status === 'completed' && 'Project has been finished successfully'}
                                                {status === 'on-hold' && 'Project is temporarily paused'}
                                                {status === 'planned' && 'Project is planned but not yet started'}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {projectStatus !== project.status && (
                                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center">
                                            <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                                            <span className="text-blue-800 font-medium">Status Change</span>
                                        </div>
                                        <p className="text-blue-700 text-sm mt-1">
                                            You are about to change the project status from{' '}
                                            <span className="font-medium">{project.status}</span> to{' '}
                                            <span className="font-medium">{projectStatus}</span>.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    {activeTab === 'status' && projectStatus !== project.status && (
                        <button
                            onClick={handleStatusChange}
                            className="px-4 py-2 bg-primary text-white hover:bg-hoverBlue rounded-lg transition"
                        >
                            Update Status
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectSettingsModal;