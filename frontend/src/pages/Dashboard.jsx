import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
	Calendar,
	ChevronRight,
	CheckCircle2,
	Clock,
	AlertTriangle,
	Users,
	BarChart3
} from "lucide-react";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import BurndownChart from "../components/common/BurndownChart";

function Dashboard() {
	const [user, setUser] = useState(null);
	const [projects, setProjects] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDashboardData = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				setError("Not authenticated");
				setIsLoading(false);
				return;
			}

			try {
				const userResponse = await axios.get(
					"http://localhost:8080/api/user/profile",
					{
						headers: { Authorization: `Bearer ${token}` }
					}
				);
				setUser(userResponse.data);

				setProjects([
					{
						id: 1,
						name: "E-commerce Platform",
						progress: 65,
						status: "In Progress",
						members: 8
					},
					{
						id: 2,
						name: "Mobile Banking App",
						progress: 32,
						status: "In Progress",
						members: 6
					},
					{
						id: 3,
						name: "Internal HR Portal",
						progress: 89,
						status: "Testing",
						members: 4
					},
					{
						id: 4,
						name: "Customer Support System",
						progress: 100,
						status: "Completed",
						members: 5
					}
				]);

				setTasks([
					{
						id: 1,
						title: "Implement user authentication",
						priority: "High",
						status: "In Progress",
						dueDate: "2025-05-20"
					},
					{
						id: 2,
						title: "Fix navigation bug on mobile",
						priority: "Critical",
						status: "To Do",
						dueDate: "2025-05-18"
					},
					{
						id: 3,
						title: "Create API documentation",
						priority: "Medium",
						status: "In Progress",
						dueDate: "2025-05-25"
					},
					{
						id: 4,
						title: "Design landing page",
						priority: "Medium",
						status: "To Do",
						dueDate: "2025-05-22"
					},
					{
						id: 5,
						title: "Unit testing for cart module",
						priority: "High",
						status: "In Review",
						dueDate: "2025-05-19"
					}
				]);

				setIsLoading(false);
			} catch (err) {
				console.error("Error fetching dashboard data:", err);
				setError("Failed to load dashboard data");
				setIsLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	const getStatusColor = status => {
		switch (status.toLowerCase()) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "in progress":
				return "bg-blue-100 text-blue-800";
			case "testing":
				return "bg-purple-100 text-purple-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getPriorityColor = priority => {
		switch (priority.toLowerCase()) {
			case "critical":
				return "text-red-600";
			case "high":
				return "text-orange-500";
			case "medium":
				return "text-blue-500";
			case "low":
				return "text-green-500";
			default:
				return "text-gray-500";
		}
	};

	const getTaskStatusColor = status => {
		switch (status.toLowerCase()) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "in progress":
				return "bg-blue-100 text-blue-800";
			case "in review":
				return "bg-yellow-100 text-yellow-800";
			case "to do":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const formatDate = dateString => {
		const options = { year: "numeric", month: "short", day: "numeric" };
		return new Date(dateString).toLocaleDateString("en-US", options);
	};

	const calculateDaysLeft = dueDate => {
		const today = new Date();
		const due = new Date(dueDate);
		const diffTime = due - today;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
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
				{user &&
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-800">
							Welcome, {user.fullName}!
						</h1>
						<p className="text-gray-600">
							Here's what's happening with your projects today.
						</p>
					</div>}

				{/* Dashboard Overview Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-gray-500 font-medium">Total Projects</h3>
							<span className="p-2 bg-blue-50 rounded-lg">
								<BarChart3 className="h-5 w-5 text-blue-500" />
							</span>
						</div>
						<p className="text-3xl font-bold text-gray-800">
							{projects.length}
						</p>
						<div className="flex items-center mt-2 text-sm text-green-600">
							<span className="flex items-center">
								<CheckCircle2 className="h-4 w-4 mr-1" />
								{projects.filter(p => p.status === "Completed").length}{" "}
								completed
							</span>
						</div>
					</div>

					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-gray-500 font-medium">Open Tasks</h3>
							<span className="p-2 bg-yellow-50 rounded-lg">
								<Clock className="h-5 w-5 text-yellow-500" />
							</span>
						</div>
						<p className="text-3xl font-bold text-gray-800">
							{tasks.length}
						</p>
						<div className="flex items-center mt-2 text-sm text-orange-600">
							<span className="flex items-center">
								<AlertTriangle className="h-4 w-4 mr-1" />
								{
									tasks.filter(
										task =>
											task.priority === "Critical" || task.priority === "High"
									).length
								}{" "}
								high priority
							</span>
						</div>
					</div>

					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-gray-500 font-medium">Upcoming Deadlines</h3>
							<span className="p-2 bg-red-50 rounded-lg">
								<Calendar className="h-5 w-5 text-red-500" />
							</span>
						</div>
						<p className="text-3xl font-bold text-gray-800">
							{
								tasks.filter(
									task =>
										calculateDaysLeft(task.dueDate) <= 3 &&
										task.status !== "Completed"
								).length
							}
						</p>
						<div className="flex items-center mt-2 text-sm text-red-600">
							<span className="flex items-center">
								<AlertTriangle className="h-4 w-4 mr-1" />
								{
									tasks.filter(
										task =>
											calculateDaysLeft(task.dueDate) <= 1 &&
											task.status !== "Completed"
									).length
								}{" "}
								due today/tomorrow
							</span>
						</div>
					</div>

					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-gray-500 font-medium">Team Members</h3>
							<span className="p-2 bg-purple-50 rounded-lg">
								<Users className="h-5 w-5 text-purple-500" />
							</span>
						</div>
						<p className="text-3xl font-bold text-gray-800">
							{projects.reduce((sum, project) => sum + project.members, 0)}
						</p>
						<div className="flex items-center mt-2 text-sm text-purple-600">
							<span className="flex items-center">
								<CheckCircle2 className="h-4 w-4 mr-1" />
								Across {projects.length} projects
							</span>
						</div>
					</div>
				</div>

				{/* Add Burndown Chart Section here */}
				<div className="mb-10">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold text-gray-800">
							Sprint Progress
						</h2>
						<div className="flex items-center text-sm text-gray-500">
							<Calendar className="h-4 w-4 mr-1" />
							<span>Current Sprint</span>
						</div>
					</div>
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
						<BurndownChart />
					</div>
				</div>

				{/* Projects Section */}
				<div className="mb-10">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold text-gray-800">Projects</h2>
						<Link
							to="/projects"
							className="text-primary hover:text-hoverBlue flex items-center">
							View All <ChevronRight className="h-4 w-4 ml-1" />
						</Link>
					</div>

					<div className="bg-white rounded-xl shadow-sm overflow-hidden">
						<div className="overflow-x-auto">
							<table className="min-w-full">
								<thead className="bg-gray-50 border-b border-gray-100">
									<tr>
										<th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
											Project Name
										</th>
										<th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
											Progress
										</th>
										<th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
											Status
										</th>
										<th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
											Team
										</th>
										<th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100">
									{projects.map(project =>
										<tr key={project.id} className="hover:bg-gray-50">
											<td className="py-4 px-6">
												<div className="font-medium text-gray-900">
													{project.name}
												</div>
											</td>
											<td className="py-4 px-6">
												<div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
													<div
														className="bg-primary h-2.5 rounded-full"
														style={{ width: `${project.progress}%` }}
													/>
												</div>
												<div className="text-xs text-gray-500">
													{project.progress}% completed
												</div>
											</td>
											<td className="py-4 px-6">
												<span
													className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
														project.status
													)}`}>
													{project.status}
												</span>
											</td>
											<td className="py-4 px-6">
												<div className="flex items-center">
													<div className="flex -space-x-2 mr-2">
														{[
															...Array(Math.min(3, project.members))
														].map((_, i) =>
															<div
																key={i}
																className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
																{String.fromCharCode(65 + i)}
															</div>
														)}
													</div>
													{project.members > 3 &&
														<span className="text-xs text-gray-500">
															+{project.members - 3} more
														</span>}
												</div>
											</td>
											<td className="py-4 px-6">
												<Link
													to={`/projects/${project.id}`}
													className="text-primary hover:text-hoverBlue font-medium">
													View
												</Link>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				{/* Tasks Section */}
				<div>
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
						<Link
							to="/tasks"
							className="text-primary hover:text-hoverBlue flex items-center">
							View All <ChevronRight className="h-4 w-4 ml-1" />
						</Link>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{tasks.slice(0, 6).map(task =>
							<div
								key={task.id}
								className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
								<div className="flex justify-between items-start mb-3">
									<h3 className="font-medium text-gray-900 pr-4">
										{task.title}
									</h3>
									<span
										className={`text-sm font-medium ${getPriorityColor(
											task.priority
										)}`}>
										{task.priority}
									</span>
								</div>
								<div className="flex items-center justify-between mb-4">
									<span
										className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(
											task.status
										)}`}>
										{task.status}
									</span>
									<div className="flex items-center text-sm text-gray-500">
										<Calendar className="h-4 w-4 mr-1" />
										<span>
											{formatDate(task.dueDate)}
										</span>
									</div>
								</div>
								<div className="flex justify-between items-center">
									<Link
										to={`/tasks/${task.id}`}
										className="text-primary hover:text-hoverBlue text-sm font-medium">
										View details
									</Link>
									<div
										className={`text-sm ${calculateDaysLeft(task.dueDate) <= 2
											? "text-red-500"
											: "text-gray-500"}`}>
										{calculateDaysLeft(task.dueDate)} days left
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}

export default Dashboard;
