import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	Calendar,
	ChevronRight,
	CheckCircle2,
	Clock,
	AlertTriangle,
	Users,
	BarChart3,
	TrendingUp,
	Target,
	TestTube,
	Zap,
	Activity,
	RefreshCw
} from "lucide-react";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import BurndownChart from "../components/common/BurndownChart";
import StatsCard from "../components/dashboard/StatsCard";
import ProjectCard from "../components/dashboard/ProjectCard";
import TasksOverview from "../components/dashboard/TasksOverview";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import dashboardApi from "../services/dashboardApi";

function Dashboard() {
	const [dashboardData, setDashboardData] = useState({
		user: null,
		projects: [],
		tasks: [],
		stats: {}
	});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [lastUpdated, setLastUpdated] = useState(new Date());

	const fetchDashboardData = async () => {
		try {
			setIsLoading(true);
			setError(null);
			
			const data = await dashboardApi.getDashboardOverview();
			setDashboardData(data);
			setLastUpdated(new Date());
		} catch (err) {
			console.error("Error fetching dashboard data:", err);
			setError("Failed to load dashboard data");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchDashboardData();

		const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
		return () => clearInterval(interval);
	}, []);

	const { user, projects, tasks, stats } = dashboardData;

	const formatLastUpdated = () => {
		return lastUpdated.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	if (isLoading) {
		return (
			<div className="flex flex-col min-h-screen">
				<Navbar />
				<div className="flex-grow flex items-center justify-center">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
				</div>
				<Footer />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col min-h-screen">
				<Navbar />
				<div className="flex-grow flex items-center justify-center">
					<div className="text-center">
						<AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-gray-800 mb-2">
							Error Loading Dashboard
						</h2>
						<p className="text-gray-600">
							{error}
						</p>
						<Link
							to="/login"
							className="mt-6 inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-hoverBlue transition">
							Return to Login
						</Link>
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen bg-gray-50">
			<Navbar />

			<main className="flex-grow container mx-auto px-4 py-8">
				{/* Header with refresh option */}
				<div className="flex items-center justify-between mb-8">
					<div>
						{user && (
							<>
								<h1 className="text-3xl font-bold text-gray-800">
									Welcome back, {user.fullName}!
								</h1>
								<p className="text-gray-600 mt-1">
									Here's your Scrum Master dashboard overview
								</p>
							</>
						)}
					</div>
					<div className="flex items-center space-x-4">
						<div className="flex items-center text-sm text-gray-500">
							<Activity className="h-4 w-4 mr-1" />
							<span>Last updated: {formatLastUpdated()}</span>
						</div>
						<button
							onClick={fetchDashboardData}
							disabled={isLoading}
							className="flex items-center px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
						>
							<RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
							Refresh
						</button>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
					<StatsCard
						title="Total Projects"
						value={stats.projects?.total || 0}
						subtitle={`${stats.projects?.completed || 0} completed`}
						icon={BarChart3}
						color="blue"
						trend="up"
						trendValue={`${stats.projects?.completionRate || 0}%`}
					/>
					<StatsCard
						title="Total Tasks"
						value={stats.tasks?.total || 0}
						subtitle={`${stats.tasks?.highPriority || 0} high priority`}
						icon={Target}
						color="purple"
						trend="neutral"
						trendValue={`${stats.tasks?.completionRate || 0}% done`}
					/>
					<StatsCard
						title="Upcoming Deadlines"
						value={stats.deadlines?.upcoming || 0}
						subtitle={`${stats.deadlines?.dueTodayTomorrow || 0} due soon`}
						icon={Calendar}
						color="red"
						trend={stats.deadlines?.dueTodayTomorrow > 0 ? "up" : "neutral"}
						trendValue={stats.deadlines?.dueTodayTomorrow > 0 ? "urgent" : "on track"}
					/>
					<StatsCard
						title="Team Members"
						value={stats.team?.totalMembers || 0}
						subtitle={`across ${projects.length} projects`}
						icon={Users}
						color="green"
						trend="neutral"
						trendValue={`${stats.team?.projectsPerMember || 0} avg per member`}
					/>
				</div>

				{/* Additional Stats Row */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
					<StatsCard
						title="Tasks in Progress"
						value={stats.tasks?.inProgress || 0}
						subtitle="currently active"
						icon={Zap}
						color="yellow"
						trend="neutral"
					/>
					<StatsCard
						title="Testing Phase"
						value={stats.testing?.inTesting || 0}
						subtitle={`${stats.testing?.bugsFound || 0} bugs found`}
						icon={TestTube}
						color="indigo"
						trend={stats.testing?.bugsFound > 0 ? "down" : "up"}
						trendValue={stats.testing?.bugsFound > 0 ? "needs attention" : "looking good"}
					/>
					<StatsCard
						title="Completion Rate"
						value={`${stats.tasks?.completionRate || 0}%`}
						subtitle="overall progress"
						icon={CheckCircle2}
						color="green"
						trend={parseFloat(stats.tasks?.completionRate || 0) > 70 ? "up" : "neutral"}
						trendValue={parseFloat(stats.tasks?.completionRate || 0) > 70 ? "excellent" : "improving"}
					/>
				</div>

				{/* Charts Section */}
				<div className="mb-10">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold text-gray-800">Analytics Overview</h2>
					</div>
					<DashboardCharts projects={projects} tasks={tasks} stats={stats} />
				</div>

				{/* Burndown Chart */}
				<div className="mb-10">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold text-gray-800">Sprint Progress</h2>
						<div className="flex items-center text-sm text-gray-500">
							<Calendar className="h-4 w-4 mr-1" />
							<span>Current Sprint</span>
						</div>
					</div>
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
						<BurndownChart />
					</div>
				</div>

				{/* Projects Grid */}
				<div className="mb-10">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold text-gray-800">Your Projects</h2>
						<Link
							to="/scrummaster/projects"
							className="text-primary hover:text-blue-600 flex items-center font-medium"
						>
							View All <ChevronRight className="h-4 w-4 ml-1" />
						</Link>
					</div>

					{projects.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{projects.slice(0, 6).map((project) => (
								<ProjectCard key={project.id} project={project} />
							))}
						</div>
					) : (
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
							<BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
							<p className="text-gray-500 mb-4">Create your first project to get started</p>
							<Link
								to="/scrummaster/projects"
								className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
							>
								<BarChart3 className="h-4 w-4 mr-2" />
								Create Project
							</Link>
						</div>
					)}
				</div>

				{/* Recent Tasks */}
				<div>
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold text-gray-800">Recent Tasks</h2>
						<Link
							to="/scrummaster/task-assignment"
							className="text-primary hover:text-blue-600 flex items-center font-medium"
						>
							View All <ChevronRight className="h-4 w-4 ml-1" />
						</Link>
					</div>
					<TasksOverview tasks={tasks} limit={9} />
				</div>
			</main>

			<Footer />
		</div>
	);
}

export default Dashboard;
