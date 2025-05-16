import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SprintBoard from "./pages/SprintBoard";
import ProjectDescription from "./pages/ProjectDescription";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/projects/:projectId" element={<ProjectDescription />} />
				<Route
					path="/projects/:projectId/sprint-board"
					element={<SprintBoard />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
