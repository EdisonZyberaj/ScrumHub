import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

class DashboardApiService {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_BASE_URL,
        });

        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    async getUserProfile() {
        try {
            const response = await this.axiosInstance.get('/user/profile');
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    }

    async getProjects() {
        try {
            const response = await this.axiosInstance.get('/projects');
            return response.data;
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    }

    async getProjectStats(projectId) {
        try {
            const response = await this.axiosInstance.get(`/projects/${projectId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching project ${projectId} stats:`, error);
            throw error;
        }
    }

    async getSprints(projectId) {
        try {
            const response = await this.axiosInstance.get('/sprints', {
                params: projectId ? { projectId } : {}
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching sprints:', error);
            throw error;
        }
    }

    async getTasks(params = {}) {
        try {
            const response = await this.axiosInstance.get('/tasks', {
                params
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    }

    async getDashboardOverview() {
        try {
            const [projects, user] = await Promise.all([
                this.getProjects(),
                this.getUserProfile()
            ]);

            let allTasks = [];
            if (projects.length > 0) {
                const taskPromises = projects.map(project => 
                    this.getTasks({ projectId: project.id }).catch(() => [])
                );
                const tasksArrays = await Promise.all(taskPromises);
                allTasks = tasksArrays.flat();
            }

            const stats = this.calculateDashboardStats(projects, allTasks, user);
            
            return {
                user,
                projects,
                tasks: allTasks,
                stats
            };
        } catch (error) {
            console.error('Error fetching dashboard overview:', error);
            throw error;
        }
    }

    async getBoardData(projectId, sprintId) {
        try {
            const response = await this.axiosInstance.get('/boards/scrum-master', {
                params: { projectId, sprintId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching board data:', error);
            throw error;
        }
    }

    async getActiveSprints() {
        try {
            const projects = await this.getProjects();
            const sprintPromises = projects.map(project => 
                this.getSprints(project.id).catch(() => [])
            );
            const sprintArrays = await Promise.all(sprintPromises);
            const allSprints = sprintArrays.flat();
            
            return allSprints.filter(sprint => sprint.status === 'ACTIVE');
        } catch (error) {
            console.error('Error fetching active sprints:', error);
            throw error;
        }
    }

    calculateDashboardStats(projects, tasks, user) {
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
        const oneDayFromNow = new Date(now.getTime() + (1 * 24 * 60 * 60 * 1000));

        const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
        const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
        const totalMembers = projects.reduce((sum, p) => sum + (p.memberCount || 0), 0);

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'DONE').length;
        const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
        const highPriorityTasks = tasks.filter(t => 
            t.priority === 'HIGH' || t.priority === 'CRITICAL'
        ).length;

        const upcomingDeadlines = tasks.filter(t => {
            if (!t.dueDate || t.status === 'DONE') return false;
            const dueDate = new Date(t.dueDate);
            return dueDate <= threeDaysFromNow && dueDate >= now;
        }).length;

        const dueTodayTomorrow = tasks.filter(t => {
            if (!t.dueDate || t.status === 'DONE') return false;
            const dueDate = new Date(t.dueDate);
            return dueDate <= oneDayFromNow && dueDate >= now;
        }).length;

        const tasksInTesting = tasks.filter(t => 
            t.status === 'IN_TESTING' || t.status === 'READY_FOR_TESTING'
        ).length;

        const bugsFound = tasks.filter(t => t.status === 'BUG_FOUND').length;

        return {
            projects: {
                total: projects.length,
                completed: completedProjects,
                active: activeProjects,
                completionRate: projects.length > 0 ? (completedProjects / projects.length * 100).toFixed(1) : 0
            },
            tasks: {
                total: totalTasks,
                completed: completedTasks,
                inProgress: inProgressTasks,
                highPriority: highPriorityTasks,
                completionRate: totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0
            },
            deadlines: {
                upcoming: upcomingDeadlines,
                dueTodayTomorrow: dueTodayTomorrow
            },
            team: {
                totalMembers: totalMembers,
                projectsPerMember: totalMembers > 0 ? (projects.length / totalMembers).toFixed(1) : 0
            },
            testing: {
                inTesting: tasksInTesting,
                bugsFound: bugsFound
            }
        };
    }

    async getRecentActivity() {
        try {
            const tasks = await this.getTasks();
            const recentTasks = tasks
                .filter(task => {
                    const updatedAt = new Date(task.updatedAt);
                    const threeDaysAgo = new Date(Date.now() - (3 * 24 * 60 * 60 * 1000));
                    return updatedAt > threeDaysAgo;
                })
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 10);

            return recentTasks.map(task => ({
                id: task.id,
                type: 'task_updated',
                title: `Task "${task.title}" updated`,
                description: `Status changed to ${task.status}`,
                timestamp: task.updatedAt,
                user: task.assignee?.fullName || 'Unassigned',
                priority: task.priority
            }));
        } catch (error) {
            console.error('Error fetching recent activity:', error);
            return [];
        }
    }

    // Authentication methods
    async login(email, password) {
        try {
            const response = await this.axiosInstance.post('/auth/login', {
                email,
                password
            });
            return response.data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    async register(userData) {
        try {
            const response = await this.axiosInstance.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    }

    // User management methods
    async getUsers(params = {}) {
        try {
            const response = await this.axiosInstance.get('/users', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async getUserById(userId) {
        try {
            const response = await this.axiosInstance.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            throw error;
        }
    }

    async updateUserProfile(updateData) {
        try {
            const response = await this.axiosInstance.put('/user/profile', updateData);
            return response.data;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }

    async changePassword(passwordData) {
        try {
            const response = await this.axiosInstance.post('/user/change-password', passwordData);
            return response.data;
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }

    async getUserStatistics() {
        try {
            const response = await this.axiosInstance.get('/user/statistics');
            return response.data;
        } catch (error) {
            console.error('Error fetching user statistics:', error);
            throw error;
        }
    }

    async getUserActivity() {
        try {
            const response = await this.axiosInstance.get('/user/activity');
            return response.data;
        } catch (error) {
            console.error('Error fetching user activity:', error);
            throw error;
        }
    }

    // Project management methods
    async createProject(projectData) {
        try {
            const response = await this.axiosInstance.post('/projects', projectData);
            return response.data;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    }

    async updateProject(projectId, updateData) {
        try {
            const response = await this.axiosInstance.put(`/projects/${projectId}`, updateData);
            return response.data;
        } catch (error) {
            console.error(`Error updating project ${projectId}:`, error);
            throw error;
        }
    }

    async updateProjectStatus(projectId, status) {
        try {
            const response = await this.axiosInstance.put(`/projects/${projectId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error(`Error updating project ${projectId} status:`, error);
            throw error;
        }
    }

    async getProjectMembers(projectId) {
        try {
            const response = await this.axiosInstance.get(`/projects/${projectId}/members`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching project ${projectId} members:`, error);
            throw error;
        }
    }

    async addProjectMember(projectId, memberData) {
        try {
            const response = await this.axiosInstance.post(`/projects/${projectId}/members`, memberData);
            return response.data;
        } catch (error) {
            console.error(`Error adding member to project ${projectId}:`, error);
            throw error;
        }
    }

    async removeProjectMember(projectId, userId) {
        try {
            const response = await this.axiosInstance.delete(`/projects/${projectId}/members/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Error removing member from project ${projectId}:`, error);
            throw error;
        }
    }

    // Sprint management methods
    async getSprintById(sprintId) {
        try {
            const response = await this.axiosInstance.get(`/sprints/${sprintId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching sprint ${sprintId}:`, error);
            throw error;
        }
    }

    async createSprint(sprintData) {
        try {
            const response = await this.axiosInstance.post('/sprints', sprintData);
            return response.data;
        } catch (error) {
            console.error('Error creating sprint:', error);
            throw error;
        }
    }

    async updateSprint(sprintId, updateData) {
        try {
            const response = await this.axiosInstance.put(`/sprints/${sprintId}`, updateData);
            return response.data;
        } catch (error) {
            console.error(`Error updating sprint ${sprintId}:`, error);
            throw error;
        }
    }

    async activateSprint(sprintId) {
        try {
            const response = await this.axiosInstance.put(`/sprints/${sprintId}`, { active: true });
            return response.data;
        } catch (error) {
            console.error(`Error activating sprint ${sprintId}:`, error);
            throw error;
        }
    }

    async deactivateSprint(sprintId) {
        try {
            const response = await this.axiosInstance.put(`/sprints/${sprintId}`, { active: false });
            return response.data;
        } catch (error) {
            console.error(`Error deactivating sprint ${sprintId}:`, error);
            throw error;
        }
    }

    // Task management methods
    async getTaskById(taskId) {
        try {
            const response = await this.axiosInstance.get(`/tasks/${taskId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching task ${taskId}:`, error);
            throw error;
        }
    }

    async createTask(taskData) {
        try {
            const response = await this.axiosInstance.post('/tasks', taskData);
            return response.data;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    async updateTask(taskId, updateData) {
        try {
            const response = await this.axiosInstance.put(`/tasks/${taskId}`, updateData);
            return response.data;
        } catch (error) {
            console.error(`Error updating task ${taskId}:`, error);
            throw error;
        }
    }

    async updateTaskStatus(taskId, status) {
        try {
            const response = await this.axiosInstance.put(`/tasks/${taskId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error(`Error updating task ${taskId} status:`, error);
            throw error;
        }
    }

    async assignTask(taskId, assigneeId) {
        try {
            const response = await this.axiosInstance.put(`/tasks/${taskId}/assign`, { assigneeId });
            return response.data;
        } catch (error) {
            console.error(`Error assigning task ${taskId}:`, error);
            throw error;
        }
    }

    async getMyTasks() {
        try {
            const response = await this.axiosInstance.get('/tasks/my-tasks');
            return response.data;
        } catch (error) {
            console.error('Error fetching my tasks:', error);
            throw error;
        }
    }

    // Developer-specific methods
    async getDeveloperStats() {
        try {
            const response = await this.axiosInstance.get('/developer/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching developer stats:', error);
            throw error;
        }
    }

    // Tester-specific methods
    async getTesterStats() {
        try {
            const response = await this.axiosInstance.get('/tester/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching tester stats:', error);
            throw error;
        }
    }

    async getTestingBoard(params = {}) {
        try {
            const response = await this.axiosInstance.get('/boards/testing', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching testing board:', error);
            throw error;
        }
    }

    // Product Owner-specific methods
    async getBacklogItems(projectId) {
        try {
            const response = await this.axiosInstance.get(`/projects/${projectId}/backlog-items`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching backlog items for project ${projectId}:`, error);
            throw error;
        }
    }

    async getBacklogStats(projectId) {
        try {
            const response = await this.axiosInstance.get(`/projects/${projectId}/backlog-stats`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching backlog stats for project ${projectId}:`, error);
            throw error;
        }
    }

    async getEpics(projectId) {
        try {
            const response = await this.axiosInstance.get(`/projects/${projectId}/epics`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching epics for project ${projectId}:`, error);
            throw error;
        }
    }

    async getEpicStats(projectId) {
        try {
            const response = await this.axiosInstance.get(`/projects/${projectId}/epic-stats`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching epic stats for project ${projectId}:`, error);
            throw error;
        }
    }

    async getReleaseStats(projectId) {
        try {
            const response = await this.axiosInstance.get(`/projects/${projectId}/release-stats`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching release stats for project ${projectId}:`, error);
            throw error;
        }
    }

    async getRecentBacklogItems(projectId) {
        try {
            const response = await this.axiosInstance.get(`/projects/${projectId}/backlog-items/recent`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching recent backlog items for project ${projectId}:`, error);
            throw error;
        }
    }

    async getRecentEpics(projectId) {
        try {
            const response = await this.axiosInstance.get(`/projects/${projectId}/epics/recent`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching recent epics for project ${projectId}:`, error);
            throw error;
        }
    }

    async updateBacklogItem(projectId, itemId, updateData) {
        try {
            const response = await this.axiosInstance.put(`/projects/${projectId}/backlog-items/${itemId}`, updateData);
            return response.data;
        } catch (error) {
            console.error(`Error updating backlog item ${itemId}:`, error);
            throw error;
        }
    }

    async deleteBacklogItem(projectId, itemId) {
        try {
            const response = await this.axiosInstance.delete(`/projects/${projectId}/backlog-items/${itemId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting backlog item ${itemId}:`, error);
            throw error;
        }
    }

    async reorderBacklogItems(projectId, reorderData) {
        try {
            const response = await this.axiosInstance.post(`/projects/${projectId}/backlog-items/reorder`, reorderData);
            return response.data;
        } catch (error) {
            console.error(`Error reordering backlog items for project ${projectId}:`, error);
            throw error;
        }
    }

    // Board methods
    async getProjectTasksByStatus(projectId) {
        try {
            const response = await this.axiosInstance.get(`/boards/project/${projectId}/tasks-by-status`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching tasks by status for project ${projectId}:`, error);
            throw error;
        }
    }

    // Task Comment methods
    async getTaskComments(taskId) {
        try {
            const response = await this.axiosInstance.get(`/tasks/${taskId}/comments`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching comments for task ${taskId}:`, error);
            throw error;
        }
    }

    async addTaskComment(taskId, content) {
        try {
            const response = await this.axiosInstance.post(`/tasks/${taskId}/comments`, {
                content
            });
            return response.data;
        } catch (error) {
            console.error(`Error adding comment to task ${taskId}:`, error);
            throw error;
        }
    }
}

export default new DashboardApiService();