import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, requiredRole = null }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					setLoading(false);
					return;
				}

				const response = await axios.get(
					"http://localhost:8080/api/user/profile",
					{
						headers: {
							Authorization: `Bearer ${token}`
						}
					}
				);
				setUser(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Auth check failed:", error);
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				setError("Authentication failed");
				setLoading(false);
			}
		};

		checkAuth();
	}, []);

	if (loading) {
		return <LoadingSpinner />;
	}

	// Not authenticated
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	// Check role-based access
	if (requiredRole && user.role !== requiredRole) {
		// Redirect to appropriate dashboard based on user's actual role
		const roleDashboards = {
			SCRUM_MASTER: "/scrum-master",
			DEVELOPER: "/developer",
			TESTER: "/tester",
			GUEST: "/guest"
		};

		return <Navigate to={roleDashboards[user.role] || "/dashboard"} replace />;
	}

	// User is authenticated and has required role (if specified)
	return React.cloneElement(children, { user });
};

export default ProtectedRoute;
