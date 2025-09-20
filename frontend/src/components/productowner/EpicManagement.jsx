import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Layers,
	Plus,
	Search,
	Filter,
	Calendar,
	Target,
	TrendingUp,
	CheckCircle,
	Clock,
	AlertCircle,
	Edit,
	Trash2,
	BarChart3
} from "lucide-react";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

const EpicManagement = () => {
	const navigate = useNavigate();
	const [selectedProject, setSelectedProject] = useState(null);
	const [projects, setProjects] = useState([]);
	const [epics, setEpics] = useState([]);
	const [filteredEpics, setFilteredEpics] = useState([]);
	const [statistics, setStatistics] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("ALL");
	const [showCreateModal, setShowCreateModal] = useState(false);

	useEffect(
		() => {
			fetchData();
		},
		[selectedProject]
	);

	useEffect(
		() => {
			filterEpics();
		},
		[epics, searchTerm, statusFilter]
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
			}

			if (selectedProject) {
				await Promise.all([
					fetchEpics(selectedProject),
					fetchStatistics(selectedProject)
				]);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			setProjects([]);
		}
		setIsLoading(false);
	};

	const fetchEpics = async projectId => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`http://localhost:8080/api/product-owner/projects/${projectId}/epics`,
				{
					headers: { Authorization: `Bearer ${token}` }
				}
			);

			if (response.ok) {
				const data = await response.json();
				setEpics(data);
			} else {
				console.error("Failed to fetch epics:", response.status);
				setEpics([]);
			}
		} catch (error) {
			console.error("Error fetching epics:", error);
			setEpics([]);
		}
	};

	const fetchStatistics = async projectId => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`http://localhost:8080/api/product-owner/projects/${projectId}/epics/statistics`,
				{
					headers: { Authorization: `Bearer ${token}` }
				}
			);

			if (response.ok) {
				const data = await response.json();
				setStatistics(data);
			} else {
				console.error("Failed to fetch statistics:", response.status);
				setStatistics({});
			}
		} catch (error) {
			console.error("Error fetching statistics:", error);
			setStatistics({});
		}
	};

	const filterEpics = () => {
		let filtered = epics;

		if (searchTerm) {
			filtered = filtered.filter(
				epic =>
					epic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					epic.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		if (statusFilter !== "ALL") {
			filtered = filtered.filter(epic => epic.status === statusFilter);
		}

		setFilteredEpics(filtered);
	};

	const handleCreateEpic = async epicData => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`http://localhost:8080/api/product-owner/projects/${selectedProject}/epics`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify(epicData)
				}
			);

			if (response.ok) {
				await fetchEpics(selectedProject);
				await fetchStatistics(selectedProject);
				setShowCreateModal(false);
			}
		} catch (error) {
			console.error("Error creating epic:", error);
		}
	};

	const handleUpdateEpicStatus = async (epicId, newStatus) => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`http://localhost:8080/api/product-owner/epics/${epicId}/${newStatus.toLowerCase()}`,
				{
					method: "PUT",
					headers: { Authorization: `Bearer ${token}` }
				}
			);

			if (response.ok) {
				await fetchEpics(selectedProject);
				await fetchStatistics(selectedProject);
			}
		} catch (error) {
			console.error("Error updating epic status:", error);
		}
	};

	const getStatusColor = status => {
		switch (status) {
			case "NEW":
				return "bg-gray-100 text-gray-800";
			case "IN_PROGRESS":
				return "bg-blue-100 text-blue-800";
			case "COMPLETED":
				return "bg-green-100 text-green-800";
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

	const getProgressPercentage = epic => {
		return epic.estimatedStoryPoints > 0
			? Math.round(epic.completedStoryPoints / epic.estimatedStoryPoints * 100)
			: 0;
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
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-800 mb-2">
							Epic Management
						</h1>
						<p className="text-gray-600">Manage and track your project epics</p>
					</div>
					<div className="flex gap-2 mt-4 md:mt-0">
						<button
							onClick={() => setShowCreateModal(true)}
							className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-hoverBlue transition flex items-center">
							<Plus className="h-4 w-4 mr-2" />
							Create Epic
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
							<div className="bg-purple-100 rounded-lg p-2">
								<Layers className="h-6 w-6 text-purple-600" />
							</div>
							<span className="text-sm text-gray-500">Total</span>
						</div>
						<div className="text-2xl font-bold text-gray-800 mb-1">
							{statistics.totalEpics || 0}
						</div>
						<div className="text-sm text-gray-600">Epics</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between mb-4">
							<div className="bg-green-100 rounded-lg p-2">
								<CheckCircle className="h-6 w-6 text-green-600" />
							</div>
							<span className="text-sm text-gray-500">Completed</span>
						</div>
						<div className="text-2xl font-bold text-gray-800 mb-1">
							{statistics.completedEpics || 0}
						</div>
						<div className="text-sm text-gray-600">Done</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between mb-4">
							<div className="bg-blue-100 rounded-lg p-2">
								<Clock className="h-6 w-6 text-blue-600" />
							</div>
							<span className="text-sm text-gray-500">In Progress</span>
						</div>
						<div className="text-2xl font-bold text-gray-800 mb-1">
							{statistics.inProgressEpics || 0}
						</div>
						<div className="text-sm text-gray-600">Active</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between mb-4">
							<div className="bg-orange-100 rounded-lg p-2">
								<TrendingUp className="h-6 w-6 text-orange-600" />
							</div>
							<span className="text-sm text-gray-500">Progress</span>
						</div>
						<div className="text-2xl font-bold text-gray-800 mb-1">
							{statistics.totalStoryPoints > 0
								? Math.round(
										statistics.completedStoryPoints /
											statistics.totalStoryPoints *
											100
									)
								: 0}%
						</div>
						<div className="text-sm text-gray-600">Complete</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm p-4 mb-6">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
								<input
									type="text"
									placeholder="Search epics..."
									value={searchTerm}
									onChange={e => setSearchTerm(e.target.value)}
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
								/>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Filter className="h-4 w-4 text-gray-400" />
							<select
								value={statusFilter}
								onChange={e => setStatusFilter(e.target.value)}
								className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
								<option value="ALL">All Status</option>
								<option value="NEW">New</option>
								<option value="IN_PROGRESS">In Progress</option>
								<option value="COMPLETED">Completed</option>
							</select>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm">
					<div className="p-6 border-b border-gray-200">
						<h3 className="text-lg font-semibold text-gray-800">
							Epics ({filteredEpics.length})
						</h3>
					</div>
					<div className="p-6">
						{filteredEpics.length > 0
							? <div className="space-y-4">
									{filteredEpics.map(epic =>
										<div
											key={epic.id}
											className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
											<div className="flex items-start justify-between mb-4">
												<div className="flex-1">
													<h4 className="text-lg font-semibold text-gray-800 mb-2">
														{epic.title}
													</h4>
													<p className="text-gray-600 mb-3">
														{epic.description}
													</p>
													<div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
														<span>
															Target: {epic.targetRelease}
														</span>
														<span>
															Due:{" "}
															{new Date(
																epic.targetCompletionDate
															).toLocaleDateString()}
														</span>
														<span>
															Created:{" "}
															{new Date(epic.createdAt).toLocaleDateString()}
														</span>
													</div>
													<p className="text-sm text-gray-700 mb-4">
														<strong>Business Value:</strong>{" "}
														{epic.businessValue}
													</p>
												</div>
												<div className="flex items-center gap-2 ml-4">
													<button
														className="p-2 text-gray-400 hover:text-gray-600 transition"
														title="Edit Epic">
														<Edit className="h-4 w-4" />
													</button>
													<button
														className="p-2 text-gray-400 hover:text-red-600 transition"
														title="Delete Epic">
														<Trash2 className="h-4 w-4" />
													</button>
												</div>
											</div>

											<div className="flex items-center justify-between mb-4">
												<div className="flex items-center gap-3">
													<span
														className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
															epic.status
														)}`}>
														{epic.status.replace("_", " ")}
													</span>
													<span
														className={`text-sm font-medium ${getPriorityColor(
															epic.priority
														)}`}>
														{epic.priority} Priority
													</span>
												</div>
												<div className="text-sm text-gray-600">
													{epic.completedStoryPoints} /{" "}
													{epic.estimatedStoryPoints} points
												</div>
											</div>

											<div className="mb-4">
												<div className="flex justify-between text-sm text-gray-600 mb-1">
													<span>Progress</span>
													<span>
														{getProgressPercentage(epic)}%
													</span>
												</div>
												<div className="w-full bg-gray-200 rounded-full h-2">
													<div
														className="bg-primary h-2 rounded-full transition-all duration-300"
														style={{ width: `${getProgressPercentage(epic)}%` }}
													/>
												</div>
											</div>

											<div className="flex items-center gap-2">
												{epic.status === "NEW" &&
													<button
														onClick={() =>
															handleUpdateEpicStatus(epic.id, "start")}
														className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition text-sm">
														Start Epic
													</button>}
												{epic.status === "IN_PROGRESS" &&
													<button
														onClick={() =>
															handleUpdateEpicStatus(epic.id, "complete")}
														className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition text-sm">
														Complete Epic
													</button>}
												<button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm flex items-center">
													<BarChart3 className="h-3 w-3 mr-1" />
													View Details
												</button>
											</div>
										</div>
									)}
								</div>
							: <div className="text-center py-12">
									<Layers className="h-16 w-16 mx-auto text-gray-300 mb-4" />
									<h3 className="text-lg font-medium text-gray-600 mb-2">
										No epics found
									</h3>
									<p className="text-gray-500 mb-4">
										{searchTerm || statusFilter !== "ALL"
											? "Try adjusting your search or filters"
											: "Start by creating your first epic to organize your backlog items"}
									</p>
									<button
										onClick={() => setShowCreateModal(true)}
										className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-hoverBlue transition">
										Create Epic
									</button>
								</div>}
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default EpicManagement;
