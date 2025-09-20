import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	BarChart3,
	Target,
	Layers,
	Calendar,
	TrendingUp,
	Clock,
	CheckCircle,
	AlertCircle,
	Plus,
	ArrowRight,
	Users,
	Package,
	Zap
} from "lucide-react";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

const ProductOwnerDashboard = () => {
	const navigate = useNavigate();
	const [selectedProject, setSelectedProject] = useState(null);
	const [projects, setProjects] = useState([]);
	const [dashboardData, setDashboardData] = useState({
		backlogStats: {},
		epicStats: {},
		releaseStats: {},
		recentItems: [],
		recentEpics: [],
		upcomingReleases: []
	});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(
		() => {
			fetchData();
		},
		[selectedProject]
	);

	const fetchData = async () => {
		try {
			const token = localStorage.getItem("token");

			const projectsResponse = await fetch(
				"http://localhost:8080/api/projects",
				{
					headers: { Authorization: `Bearer ${token}` }
				}
			);

			if (projectsResponse.ok) {
				const projectsData = await projectsResponse.json();
				setProjects(projectsData);
				if (!selectedProject && projectsData.length > 0) {
					setSelectedProject(projectsData[0].id);
					return;
				}
			} else {
				console.error("Failed to fetch projects:", projectsResponse.status);
				setProjects([]);
			}

			if (selectedProject) {
				await fetchDashboardData(selectedProject);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			setProjects([]);
			setDashboardData({
				backlogStats: {},
				epicStats: {},
				releaseStats: {},
				recentItems: [],
				recentEpics: [],
				upcomingReleases: []
			});
		}
		setIsLoading(false);
	};

	const fetchDashboardData = async projectId => {
		try {
			const token = localStorage.getItem("token");

			const [
				backlogStats,
				epicStats,
				releaseStats,
				recentItems,
				recentEpics
			] = await Promise.all([
				fetch(
					`http://localhost:8080/api/product-owner/projects/${selectedProject}/backlog/statistics`,
					{
						headers: { Authorization: `Bearer ${token}` }
					}
				).then(res => (res.ok ? res.json() : {})),

				fetch(
					`http://localhost:8080/api/product-owner/projects/${selectedProject}/epics/statistics`,
					{
						headers: { Authorization: `Bearer ${token}` }
					}
				).then(res => (res.ok ? res.json() : {})),

				fetch(
					`http://localhost:8080/api/product-owner/projects/${selectedProject}/releases/statistics`,
					{
						headers: { Authorization: `Bearer ${token}` }
					}
				).then(res => (res.ok ? res.json() : {})),

				fetch(
					`http://localhost:8080/api/product-owner/projects/${selectedProject}/backlog/ready`,
					{
						headers: { Authorization: `Bearer ${token}` }
					}
				).then(res => (res.ok ? res.json() : [])),

				fetch(
					`http://localhost:8080/api/product-owner/projects/${selectedProject}/epics/active`,
					{
						headers: { Authorization: `Bearer ${token}` }
					}
				).then(res => (res.ok ? res.json() : []))
			]);

			setDashboardData({
				backlogStats,
				epicStats,
				releaseStats,
				recentItems,
				recentEpics,
				upcomingReleases: []
			});
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
			setDashboardData({
				backlogStats: {},
				epicStats: {},
				releaseStats: {},
				recentItems: [],
				recentEpics: [],
				upcomingReleases: []
			});
		}
	};

	const getStatusColor = status => {
		switch (status) {
			case "NEW":
				return "bg-gray-100 text-gray-800";
			case "READY":
				return "bg-green-100 text-green-800";
			case "IN_PROGRESS":
				return "bg-blue-100 text-blue-800";
			case "COMPLETED":
				return "bg-emerald-100 text-emerald-800";
			case "PLANNED":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getPriorityColor = priority => {
		switch (priority) {
			case "CRITICAL":
				return "text-red-600";
			case "HIGH":
				return "text-orange-600";
			case "MEDIUM":
				return "text-yellow-600";
			case "LOW":
				return "text-green-600";
			default:
				return "text-gray-600";
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
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
							Product Owner Dashboard
						</h1>
						<p className="text-gray-600">
							Manage your product backlog, epics, and releases
						</p>
					</div>
					<div className="flex gap-2 mt-4 md:mt-0">
						<button
							onClick={() => navigate("/productowner/backlog")}
							className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-hoverBlue transition flex items-center">
							<Target className="h-4 w-4 mr-2" />
							Manage Backlog
						</button>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm p-4 mb-6">
					<div className="flex items-center gap-4">
						<label className="text-sm font-medium text-gray-700">
							Project:
						</label>
						<select
							value={selectedProject || ""}
							onChange={e => setSelectedProject(parseInt(e.target.value))}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
							{projects.map(project =>
								<option key={project.id} value={project.id}>
									{project.name} ({project.key})
								</option>
							)}
						</select>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between mb-4">
							<div className="bg-blue-100 rounded-lg p-2">
								<Target className="h-6 w-6 text-blue-600" />
							</div>
							<span className="text-sm text-gray-500">Backlog</span>
						</div>
						<div className="text-2xl font-bold text-gray-800 mb-1">
							{dashboardData.backlogStats.totalItems || 0}
						</div>
						<div className="text-sm text-gray-600 mb-2">Total Items</div>
						<div className="flex justify-between text-xs">
							<span className="text-green-600">
								{dashboardData.backlogStats.readyItems || 0} Ready
							</span>
							<span className="text-blue-600">
								{dashboardData.backlogStats.newItems || 0} New
							</span>
						</div>
						<div className="mt-2 text-xs text-gray-500">
							{dashboardData.backlogStats.totalStoryPoints || 0} story points
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between mb-4">
							<div className="bg-purple-100 rounded-lg p-2">
								<Layers className="h-6 w-6 text-purple-600" />
							</div>
							<span className="text-sm text-gray-500">Epics</span>
						</div>
						<div className="text-2xl font-bold text-gray-800 mb-1">
							{dashboardData.epicStats.totalEpics || 0}
						</div>
						<div className="text-sm text-gray-600 mb-2">Total Epics</div>
						<div className="flex justify-between text-xs">
							<span className="text-green-600">
								{dashboardData.epicStats.completedEpics || 0} Done
							</span>
							<span className="text-blue-600">
								{dashboardData.epicStats.inProgressEpics || 0} Active
							</span>
						</div>
						{dashboardData.epicStats.overdueEpics > 0 &&
							<div className="mt-2 text-xs text-red-600">
								{dashboardData.epicStats.overdueEpics} overdue
							</div>}
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between mb-4">
							<div className="bg-green-100 rounded-lg p-2">
								<Calendar className="h-6 w-6 text-green-600" />
							</div>
							<span className="text-sm text-gray-500">Releases</span>
						</div>
						<div className="text-2xl font-bold text-gray-800 mb-1">
							{dashboardData.releaseStats.totalReleases || 0}
						</div>
						<div className="text-sm text-gray-600 mb-2">Total Releases</div>
						<div className="flex justify-between text-xs">
							<span className="text-green-600">
								{dashboardData.releaseStats.completedReleases || 0} Released
							</span>
							<span className="text-blue-600">
								{dashboardData.releaseStats.inProgressReleases || 0} Active
							</span>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between mb-4">
							<div className="bg-orange-100 rounded-lg p-2">
								<TrendingUp className="h-6 w-6 text-orange-600" />
							</div>
							<span className="text-sm text-gray-500">Velocity</span>
						</div>
						<div className="text-2xl font-bold text-gray-800 mb-1">32</div>
						<div className="text-sm text-gray-600 mb-2">Avg Story Points</div>
						<div className="text-xs text-green-600">+12% from last sprint</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					<div className="bg-white rounded-lg shadow-sm">
						<div className="flex items-center justify-between p-6 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-800">
								Recent Backlog Items
							</h3>
							<button
								onClick={() => navigate("/productowner/backlog")}
								className="text-primary hover:text-hoverBlue flex items-center text-sm">
								View All <ArrowRight className="h-4 w-4 ml-1" />
							</button>
						</div>
						<div className="p-6">
							{dashboardData.recentItems.length > 0
								? <div className="space-y-3">
										{dashboardData.recentItems.map(item =>
											<div
												key={item.id}
												className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
												<div className="flex-1">
													<h4 className="font-medium text-gray-800 mb-1">
														{item.title}
													</h4>
													<div className="flex items-center gap-2">
														<span
															className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
																item.status
															)}`}>
															{item.status}
														</span>
														<span
															className={`text-xs font-medium ${getPriorityColor(
																item.priority
															)}`}>
															{item.priority}
														</span>
														{item.storyPoints &&
															<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
																{item.storyPoints} pts
															</span>}
													</div>
												</div>
											</div>
										)}
									</div>
								: <div className="text-center py-8">
										<Target className="h-8 w-8 mx-auto text-gray-400 mb-2" />
										<p className="text-gray-500">No backlog items yet</p>
										<button
											onClick={() => navigate("/productowner/backlog")}
											className="mt-2 text-primary hover:text-hoverBlue">
											Create your first item
										</button>
									</div>}
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm">
						<div className="flex items-center justify-between p-6 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-800">
								Active Epics
							</h3>
							<button
								onClick={() => navigate("/productowner/epics")}
								className="text-primary hover:text-hoverBlue flex items-center text-sm">
								View All <ArrowRight className="h-4 w-4 ml-1" />
							</button>
						</div>
						<div className="p-6">
							{dashboardData.recentEpics.length > 0
								? <div className="space-y-3">
										{dashboardData.recentEpics.map(epic =>
											<div
												key={epic.id}
												className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
												<div className="flex-1">
													<h4 className="font-medium text-gray-800 mb-1">
														{epic.title}
													</h4>
													<div className="flex items-center gap-2">
														<span
															className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
																epic.status
															)}`}>
															{epic.status}
														</span>
														<span
															className={`text-xs font-medium ${getPriorityColor(
																epic.priority
															)}`}>
															{epic.priority}
														</span>
														{epic.estimatedStoryPoints &&
															<span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
																{epic.estimatedStoryPoints} pts
															</span>}
													</div>
												</div>
											</div>
										)}
									</div>
								: <div className="text-center py-8">
										<Layers className="h-8 w-8 mx-auto text-gray-400 mb-2" />
										<p className="text-gray-500">No epics yet</p>
										<button
											onClick={() => navigate("/productowner/epics")}
											className="mt-2 text-primary hover:text-hoverBlue">
											Create your first epic
										</button>
									</div>}
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm p-6">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">
						Quick Actions
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
						<button
							onClick={() => navigate("/productowner/backlog")}
							className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
							<Plus className="h-5 w-5 text-blue-600 mr-3" />
							<div className="text-left">
								<div className="font-medium text-blue-900">Add Story</div>
								<div className="text-sm text-blue-700">Create backlog item</div>
							</div>
						</button>
						<button
							onClick={() => navigate("/productowner/epics")}
							className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
							<Layers className="h-5 w-5 text-purple-600 mr-3" />
							<div className="text-left">
								<div className="font-medium text-purple-900">Create Epic</div>
								<div className="text-sm text-purple-700">
									Group related stories
								</div>
							</div>
						</button>
						<button
							onClick={() => navigate("/productowner/releases")}
							className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
							<Calendar className="h-5 w-5 text-green-600 mr-3" />
							<div className="text-left">
								<div className="font-medium text-green-900">Plan Release</div>
								<div className="text-sm text-green-700">Schedule features</div>
							</div>
						</button>
						<button
							onClick={() => navigate("/productowner/backlog")}
							className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition">
							<Target className="h-5 w-5 text-orange-600 mr-3" />
							<div className="text-left">
								<div className="font-medium text-orange-900">Prioritize</div>
								<div className="text-sm text-orange-700">Reorder backlog</div>
							</div>
						</button>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default ProductOwnerDashboard;
