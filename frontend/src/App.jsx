import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ScrumMasterBoard from "./pages/scrummaster/ScrumMasterBoard";
import ProjectManager from "./components/scrummaster/ProjectManager/ProjectManager";
import SprintPlanning from "./components/scrummaster/SprintPlanning/SprintPlanning";
import TaskAssignment from "./components/scrummaster/TaskAssignment/TaskAssignment";
import Developer from "./pages/developer/Developer";
import Tester from "./pages/tester/Tester";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/shared/ProtectedRoute";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Public Routes */}
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />

				{/* Protected Routes */}
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>

				{/* Profile & Settings */}
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<Profile />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/settings"
					element={
						<ProtectedRoute>
							<Settings />
						</ProtectedRoute>
					}
				/>

				{/* Scrum Master Routes */}
				<Route
					path="/scrummaster"
					element={
						<ProtectedRoute>
							<ProjectManager />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/scrummaster/projects"
					element={
						<ProtectedRoute>
							<ProjectManager />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/scrummaster/sprint-planning"
					element={
						<ProtectedRoute>
							<SprintPlanning />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/scrummaster/task-assignment"
					element={
						<ProtectedRoute>
							<TaskAssignment />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/scrummaster/project/:id"
					element={
						<ProtectedRoute>
							<ScrumMasterBoard />
						</ProtectedRoute>
					}
				/>

				{/* Developer Routes */}
				<Route
					path="/developer"
					element={
						<ProtectedRoute>
							<Developer />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/developer/tasks"
					element={
						<ProtectedRoute>
							<Developer />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/developer/board/:projectId/:sprintId"
					element={
						<ProtectedRoute>
							<Developer />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/developer/workload"
					element={
						<ProtectedRoute>
							<Developer />
						</ProtectedRoute>
					}
				/>

				{/* Tester Routes */}
				<Route
					path="/tester"
					element={
						<ProtectedRoute>
							<Tester />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/tester/tasks"
					element={
						<ProtectedRoute>
							<Tester />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/tester/board/:projectId/:sprintId"
					element={
						<ProtectedRoute>
							<Tester />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/tester/bugs"
					element={
						<ProtectedRoute>
							<Tester />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/tester/testcases"
					element={
						<ProtectedRoute>
							<Tester />
						</ProtectedRoute>
					}
				/>

				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
