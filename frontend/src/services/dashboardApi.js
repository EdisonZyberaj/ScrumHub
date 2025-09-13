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
}

export default new DashboardApiService();