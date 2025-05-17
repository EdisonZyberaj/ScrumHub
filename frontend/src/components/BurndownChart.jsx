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

function BurndownChart({ sprintId }) {
	const mockData = [
		{ day: "Day 1", remaining: 120, ideal: 120 },
		{ day: "Day 2", remaining: 118, ideal: 110 },
		{ day: "Day 3", remaining: 105, ideal: 100 },
		{ day: "Day 4", remaining: 98, ideal: 90 },
		{ day: "Day 5", remaining: 85, ideal: 80 },
		{ day: "Day 6", remaining: 84, ideal: 70 },
		{ day: "Day 7", remaining: 70, ideal: 60 },
		{ day: "Day 8", remaining: 55, ideal: 50 },
		{ day: "Day 9", remaining: 48, ideal: 40 },
		{ day: "Day 10", remaining: 38, ideal: 30 },
		{ day: "Day 11", remaining: 30, ideal: 20 },
		{ day: "Day 12", remaining: 20, ideal: 10 },
		{ day: "Day 13", remaining: 12, ideal: 0 },
		{ day: "Day 14", remaining: 0, ideal: 0 }
	];

	const mockSprint = {
		id: sprintId || 1,
		name: "Sprint 15",
		startDate: "2025-05-05",
		endDate: "2025-05-19",
		totalPoints: 120,
		completedPoints: 85,
		remainingPoints: 35,
		isActive: true
	};

	const formatDate = dateString => {
		const options = { year: "numeric", month: "short", day: "numeric" };
		return new Date(dateString).toLocaleDateString("en-US", options);
	};

	const percentComplete = Math.round(
		mockSprint.completedPoints / mockSprint.totalPoints * 100
	);

	return (
		<div className="bg-white rounded-xl shadow-sm p-6">
			<div className="flex justify-between items-start mb-6">
				<div>
					<h2 className="text-xl font-bold text-gray-800 mb-1">
						{mockSprint.name} Burndown
					</h2>
					<div className="flex items-center text-sm text-gray-500">
						<Calendar className="h-4 w-4 mr-1" />
						<span>
							{formatDate(mockSprint.startDate)} -{" "}
							{formatDate(mockSprint.endDate)}
						</span>
					</div>
				</div>
				<div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
					Active Sprint
				</div>
			</div>

			<div className="bg-gray-50 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="text-center">
					<p className="text-gray-500 text-sm mb-1">Total Story Points</p>
					<p className="text-2xl font-bold text-gray-800">
						{mockSprint.totalPoints}
					</p>
				</div>
				<div className="text-center">
					<p className="text-gray-500 text-sm mb-1">Completed</p>
					<p className="text-2xl font-bold text-green-600">
						{mockSprint.completedPoints}
					</p>
				</div>
				<div className="text-center">
					<p className="text-gray-500 text-sm mb-1">Remaining</p>
					<p className="text-2xl font-bold text-blue-600">
						{mockSprint.remainingPoints}
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
				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						data={mockData}
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
			</div>

			{mockSprint.remainingPoints > 0 &&
				mockData[mockData.length - 3].remaining >
					mockData[mockData.length - 3].ideal &&
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
