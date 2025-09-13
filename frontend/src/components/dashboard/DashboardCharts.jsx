import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
	Area,
	AreaChart
} from "recharts";

const DashboardCharts = ({ projects, tasks, stats }) => {
	const COLORS = {
		primary: "#3b82f6",
		success: "#10b981",
		warning: "#f59e0b",
		danger: "#ef4444",
		purple: "#8b5cf6",
		indigo: "#6366f1",
		pink: "#ec4899",
		gray: "#6b7280"
	};

	const PIE_COLORS = [
		COLORS.primary,
		COLORS.success,
		COLORS.warning,
		COLORS.danger,
		COLORS.purple,
		COLORS.indigo
	];

	const taskStatusData = [
		{
			name: "To Do",
			value: tasks.filter(t => t.status === "TO_DO").length,
			color: COLORS.gray
		},
		{
			name: "In Progress",
			value: tasks.filter(t => t.status === "IN_PROGRESS").length,
			color: COLORS.primary
		},
		{
			name: "Ready for Testing",
			value: tasks.filter(t => t.status === "READY_FOR_TESTING").length,
			color: COLORS.purple
		},
		{
			name: "In Testing",
			value: tasks.filter(t => t.status === "IN_TESTING").length,
			color: COLORS.warning
		},
		{
			name: "Done",
			value: tasks.filter(t => t.status === "DONE").length,
			color: COLORS.success
		},
		{
			name: "Bug Found",
			value: tasks.filter(t => t.status === "BUG_FOUND").length,
			color: COLORS.danger
		}
	].filter(item => item.value > 0);

	const projectProgressData = projects.map(project => ({
		name:
			project.name.length > 15
				? project.name.substring(0, 15) + "..."
				: project.name,
		completion:
			project.totalTasks > 0
				? Math.round(project.completedTasks / project.totalTasks * 100)
				: 0,
		totalTasks: project.totalTasks || 0,
		completedTasks: project.completedTasks || 0,
		fullName: project.name
	}));

	const priorityData = [
		{
			name: "Critical",
			value: tasks.filter(t => t.priority === "CRITICAL").length,
			color: COLORS.danger
		},
		{
			name: "High",
			value: tasks.filter(t => t.priority === "HIGH").length,
			color: COLORS.warning
		},
		{
			name: "Medium",
			value: tasks.filter(t => t.priority === "MEDIUM").length,
			color: COLORS.primary
		},
		{
			name: "Low",
			value: tasks.filter(t => t.priority === "LOW").length,
			color: COLORS.success
		}
	].filter(item => item.value > 0);

	const teamWorkloadData = projects
		.map(project => ({
			project:
				project.name.length > 12
					? project.name.substring(0, 12) + "..."
					: project.name,
			members: project.memberCount || 0,
			tasks: project.totalTasks || 0,
			avgTasksPerMember:
				project.memberCount > 0
					? Math.round((project.totalTasks || 0) / project.memberCount)
					: 0
		}))
		.filter(item => item.members > 0);

	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
					<p className="font-medium text-gray-900">
						{label}
					</p>
					{payload.map((entry, index) =>
						<p key={index} style={{ color: entry.color }} className="text-sm">
							{entry.name}: {entry.value}
						</p>
					)}
				</div>
			);
		}
		return null;
	};

	const CustomPieTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
					<p className="font-medium text-gray-900">
						{data.name}
					</p>
					<p className="text-sm" style={{ color: data.color }}>
						Count: {data.value}
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Task Status Distribution
				</h3>
				{taskStatusData.length > 0
					? <ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={taskStatusData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, percent }) =>
										`${name} ${(percent * 100).toFixed(0)}%`}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value">
									{taskStatusData.map((entry, index) =>
										<Cell key={`cell-${index}`} fill={entry.color} />
									)}
								</Pie>
								<Tooltip content={<CustomPieTooltip />} />
							</PieChart>
						</ResponsiveContainer>
					: <div className="flex items-center justify-center h-64 text-gray-500">
							No tasks available
						</div>}
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Project Completion Progress
				</h3>
				{projectProgressData.length > 0
					? <ResponsiveContainer width="100%" height={300}>
							<BarChart data={projectProgressData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip content={<CustomTooltip />} />
								<Bar
									dataKey="completion"
									fill={COLORS.primary}
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					: <div className="flex items-center justify-center h-64 text-gray-500">
							No projects available
						</div>}
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Task Priority Distribution
				</h3>
				{priorityData.length > 0
					? <ResponsiveContainer width="100%" height={300}>
							<BarChart data={priorityData} layout="horizontal">
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis type="number" />
								<YAxis dataKey="name" type="category" width={80} />
								<Tooltip content={<CustomTooltip />} />
								<Bar
									dataKey="value"
									fill={COLORS.primary}
									radius={[0, 4, 4, 0]}>
									{priorityData.map((entry, index) =>
										<Cell key={`cell-${index}`} fill={entry.color} />
									)}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					: <div className="flex items-center justify-center h-64 text-gray-500">
							No tasks available
						</div>}
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Team Workload (Avg Tasks per Member)
				</h3>
				{teamWorkloadData.length > 0
					? <ResponsiveContainer width="100%" height={300}>
							<LineChart data={teamWorkloadData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="project" />
								<YAxis />
								<Tooltip content={<CustomTooltip />} />
								<Line
									type="monotone"
									dataKey="avgTasksPerMember"
									stroke={COLORS.primary}
									strokeWidth={3}
									dot={{ fill: COLORS.primary, strokeWidth: 2, r: 6 }}
									activeDot={{ r: 8 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					: <div className="flex items-center justify-center h-64 text-gray-500">
							No team data available
						</div>}
			</div>
		</div>
	);
};

export default DashboardCharts;
