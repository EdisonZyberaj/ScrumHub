import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	Users,
	CheckCircle,
	Clock,
	Calendar,
	ArrowRight,
	AlertCircle
} from "lucide-react";
import axios from "axios";

function ProjectDescription({ projectId }) {
	const [project, setProject] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(
		() => {
			const fetchProjectData = async () => {
				const token = localStorage.getItem("token");
				if (!token) {
					setError("Not authenticated");
					setIsLoading(false);
					return;
				}

				try {
					// duhet te behet lidhje reale me back
					const mockProject = {
						id: projectId || 1,
						name: "ScrumHub: Project Management Tool",
						description:
							"A comprehensive Scrum project management application designed to streamline agile workflows and enhance team collaboration.",
						startDate: "2025-01-10",
						endDate: "2025-07-30",
						status: "In Progress",
						progress: 68,
						teamMembers: [
							{ id: 1, name: "John Smith", role: "Scrum Master" },
							{ id: 2, name: "Alex Wong", role: "Developer" },
							{ id: 3, name: "Emily Johnson", role: "Designer" },
							{ id: 4, name: "Michael Brown", role: "Developer" },
							{ id: 5, name: "Sarah Davis", role: "Tester" }
						],
						taskStats: {
							completed: 24,
							inProgress: 12,
							todo: 10,
							total: 46
						},
						currentSprint: {
							name: "Sprint 4",
							endDate: "2025-05-19",
							progress: 45
						}
					};

					setProject(mockProject);
					setIsLoading(false);
				} catch (err) {
					console.error("Error fetching project data:", err);
					setError("Failed to load project data");
					setIsLoading(false);
				}
			};

			fetchProjectData();
		},
		[projectId]
	);

	const getStatusColor = status => {
		switch (status.toLowerCase()) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "in progress":
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const formatDate = dateString => {
		const options = { year: "numeric", month: "short", day: "numeric" };
		return new Date(dateString).toLocaleDateString("en-US", options);
	};

	const calculateDaysLeft = endDate => {
		const today = new Date();
		const end = new Date(endDate);
		const diffTime = end - today;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const getInitials = name => {
		if (!name) return "?";
		return name.split(" ").map(part => part[0]).join("").toUpperCase();
	};

	if (isLoading) {
		return (
			<div className="bg-white p-6 rounded-lg shadow-md">
				<div className="animate-pulse flex flex-col space-y-4">
					<div className="h-6 bg-gray-200 rounded w-3/4" />
					<div className="h-4 bg-gray-200 rounded w-full" />
					<div className="h-4 bg-gray-200 rounded w-5/6" />
					<div className="h-24 bg-gray-200 rounded" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-white p-6 rounded-lg shadow-md">
				<div className="flex items-center text-red-500 mb-4">
					<AlertCircle className="h-5 w-5 mr-2" />
					<span className="font-medium">Error loading project</span>
				</div>
				<p className="text-gray-600">
					{error}
				</p>
			</div>
		);
	}

	if (!project) {
		return null;
	}

	return (
		<div className="bg-white rounded-lg shadow-md overflow-hidden">
			<div className="p-6">
				<div className="flex justify-between items-start mb-4">
					<div>
						<h2 className="text-2xl font-bold text-gray-800">
							{project.name}
						</h2>
						<div className="flex items-center mt-1">
							<span
								className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
									project.status
								)}`}>
								{project.status}
							</span>
							<span className="text-sm text-gray-500 ml-3 flex items-center">
								<Calendar className="h-4 w-4 mr-1" />
								{formatDate(project.startDate)} - {formatDate(project.endDate)}
							</span>
						</div>
					</div>
					<Link
						to={`/projects/${project.id}`}
						className="text-primary hover:text-hoverBlue text-sm font-medium flex items-center">
						View Details <ArrowRight className="h-4 w-4 ml-1" />
					</Link>
				</div>

				<p className="text-gray-600 mb-6">
					{project.description}
				</p>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					<div className="bg-gray-50 p-4 rounded-lg">
						<div className="flex items-center text-gray-700 mb-3">
							<Users className="h-5 w-5 mr-2 text-primary" />
							<h3 className="font-medium">Team</h3>
						</div>
						<div className="flex -space-x-2 mb-3">
							{project.teamMembers.slice(0, 5).map(member =>
								<div
									key={member.id}
									className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm border-2 border-white"
									title={`${member.name} (${member.role})`}>
									{getInitials(member.name)}
								</div>
							)}
							{project.teamMembers.length > 5 &&
								<div className="w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-sm border-2 border-white">
									+{project.teamMembers.length - 5}
								</div>}
						</div>
						<p className="text-gray-600 text-sm">
							{project.teamMembers.length} team members working on this project
						</p>
					</div>

					<div className="bg-gray-50 p-4 rounded-lg">
						<div className="flex items-center text-gray-700 mb-3">
							<CheckCircle className="h-5 w-5 mr-2 text-green-500" />
							<h3 className="font-medium">Task Completion</h3>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
							<div
								className="bg-green-500 h-2.5 rounded-full"
								style={{
									width: `${project.taskStats.completed /
										project.taskStats.total *
										100}%`
								}}
							/>
						</div>
						<div className="flex justify-between text-sm text-gray-600">
							<span>
								{project.taskStats.completed} of {project.taskStats.total} tasks
								completed
							</span>
							<span className="font-medium">
								{Math.round(
									project.taskStats.completed / project.taskStats.total * 100
								)}%
							</span>
						</div>
						<div className="flex justify-between mt-2 text-xs text-gray-500">
							<span>
								{project.taskStats.inProgress} in progress
							</span>
							<span>
								{project.taskStats.todo} to do
							</span>
						</div>
					</div>

					<div className="bg-gray-50 p-4 rounded-lg">
						<div className="flex items-center text-gray-700 mb-3">
							<Clock className="h-5 w-5 mr-2 text-blue-500" />
							<h3 className="font-medium">Current Sprint</h3>
						</div>
						<p className="font-medium text-gray-800 mb-2">
							{project.currentSprint.name}
						</p>
						<div className="flex items-center text-sm text-gray-600 mb-2">
							<div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
							<span>
								{project.currentSprint.progress}% complete
							</span>
						</div>
						<div className="text-sm text-gray-600">
							<span className="font-medium">
								{calculateDaysLeft(project.currentSprint.endDate)}
							</span>{" "}
							days remaining
						</div>
					</div>
				</div>

				<div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
					<div className="flex items-center">
						<div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-3">
							{getInitials(project.teamMembers[0].name)}
						</div>
						<span className="text-sm text-gray-600">
							<span className="font-medium">
								{project.teamMembers[0].name}
							</span>{" "}
							(Scrum Master)
						</span>
					</div>
					<div className="text-sm text-gray-500">
						Project Progress:{" "}
						<span className="font-medium text-gray-700">
							{project.progress}%
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProjectDescription;
