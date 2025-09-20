import React from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from "recharts";
import { Calendar, AlertTriangle } from "lucide-react";

function BurndownChart({ sprintId, sprintData, burndownData }) {
	
	const chartData = burndownData || [];
	const sprint = sprintData || {
		id: sprintId || null,
		name: "No Sprint Selected",
		startDate: null,
		endDate: null,
		totalPoints: 0,
		completedPoints: 0,
		remainingPoints: 0,
		isActive: false
	};

	const formatDate = dateString => {
		const options = { year: "numeric", month: "short", day: "numeric" };
		return new Date(dateString).toLocaleDateString("en-US", options);
	};

	const percentComplete = sprint.totalPoints > 0
		? Math.round((sprint.completedPoints / sprint.totalPoints) * 100)
		: 0;

	return (
		<div className="bg-white rounded-xl shadow-sm p-6">
			<div className="flex justify-between items-start mb-6">
				<div>
					<h2 className="text-xl font-bold text-gray-800 mb-1">
						{sprint.name} Burndown
					</h2>
					{sprint.startDate && sprint.endDate && (
						<div className="flex items-center text-sm text-gray-500">
							<Calendar className="h-4 w-4 mr-1" />
							<span>
								{formatDate(sprint.startDate)} -{" "}
								{formatDate(sprint.endDate)}
							</span>
						</div>
					)}
				</div>
				{sprint.isActive && (
					<div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
						Active Sprint
					</div>
				)}
			</div>

			<div className="bg-gray-50 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="text-center">
					<p className="text-gray-500 text-sm mb-1">Total Story Points</p>
					<p className="text-2xl font-bold text-gray-800">
						{sprint.totalPoints}
					</p>
				</div>
				<div className="text-center">
					<p className="text-gray-500 text-sm mb-1">Completed</p>
					<p className="text-2xl font-bold text-green-600">
						{sprint.completedPoints}
					</p>
				</div>
				<div className="text-center">
					<p className="text-gray-500 text-sm mb-1">Remaining</p>
					<p className="text-2xl font-bold text-blue-600">
						{sprint.remainingPoints}
					</p>
				</div>
			</div>

			<div className="mb-6">
				<div className="flex justify-between items-center mb-1">
					<span className="text-sm font-medium text-gray-700">
						Sprint Progress
					</span>
					<span className="text-sm font-medium text-gray-700">
						{percentComplete}%
					</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-2.5">
					<div
						className="bg-primary h-2.5 rounded-full"
						style={{ width: `${percentComplete}%` }}
					/>
				</div>
			</div>

			<div className="h-72">
				{chartData.length > 0 ? (
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={chartData}
							margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="day" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line
								type="monotone"
								dataKey="remaining"
								stroke="#3b82f6"
								strokeWidth={2}
								activeDot={{ r: 8 }}
								name="Actual Remaining"
							/>
							<Line
								type="monotone"
								dataKey="ideal"
								stroke="#9ca3af"
								strokeWidth={2}
								strokeDasharray="5 5"
								name="Ideal Burndown"
							/>
						</LineChart>
					</ResponsiveContainer>
				) : (
					<div className="flex items-center justify-center h-full text-gray-500">
						<div className="text-center">
							<p className="text-lg mb-2">No burndown data available</p>
							<p className="text-sm">Burndown chart will appear once sprint has started and tasks are being tracked.</p>
						</div>
					</div>
				)}
			</div>

			{sprint.remainingPoints > 0 &&
				chartData.length > 3 &&
				chartData[chartData.length - 3]?.remaining >
					chartData[chartData.length - 3]?.ideal &&
				<div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 flex items-start">
					<AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
					<div>
						<h3 className="text-sm font-medium text-yellow-800">
							Sprint at Risk
						</h3>
						<p className="mt-1 text-sm text-yellow-700">
							The current burndown trend indicates this sprint may not complete
							all planned work. Consider addressing blockers or adjusting scope.
						</p>
					</div>
				</div>}
		</div>
	);
}

export default BurndownChart;
