import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Target, TrendingUp } from 'lucide-react';

const ProjectCard = ({ project }) => {
    const getStatusColor = (status) => {
        const statusColors = {
            'ACTIVE': 'bg-blue-100 text-blue-800',
            'COMPLETED': 'bg-green-100 text-green-800',
            'ON_HOLD': 'bg-yellow-100 text-yellow-800',
            'PLANNED': 'bg-gray-100 text-gray-800'
        };
        return statusColors[status] || statusColors.PLANNED;
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 80) return 'bg-green-500';
        if (percentage >= 60) return 'bg-blue-500';
        if (percentage >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const completionPercentage = project.totalTasks > 0 
        ? Math.round((project.completedTasks / project.totalTasks) * 100)
        : 0;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
           
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {project.description || 'No description available'}
                    </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status?.replace('_', ' ') || 'Unknown'}
                </span>
            </div>

            
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">
                        {completionPercentage}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className={`h-2.5 rounded-full transition-all duration-300 ${getProgressColor(completionPercentage)}`}
                        style={{ width: `${completionPercentage}%` }}
                    />
                </div>
            </div>

           
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <Target className="h-4 w-4 mr-2" />
                    <span>{project.completedTasks || 0}/{project.totalTasks || 0} tasks</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{project.memberCount || 0} members</span>
                </div>
            </div>

            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Start: {formatDate(project.startDate)}</span>
                </div>
                <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>End: {formatDate(project.endDate)}</span>
                </div>
            </div>

            
            {project.sprintCount > 0 && (
                <div className="flex items-center text-xs text-gray-600 mb-4 p-2 bg-gray-50 rounded-lg">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>{project.sprintCount} active sprint{project.sprintCount !== 1 ? 's' : ''}</span>
                </div>
            )}

            
            <Link
                to={`/scrummaster/project/${project.id}`}
                className="w-full bg-primary text-white text-center py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium text-sm"
            >
                View Project Board
            </Link>
        </div>
    );
};

export default ProjectCard;