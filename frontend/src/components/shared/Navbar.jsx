import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu, X, PlusCircle, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					setUser(null);
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
				console.error("Error fetching user profile:", error);
				setUser(null);
				setLoading(false);
			}
		};

		fetchUserProfile();
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user_id");
		setUser(null);
		navigate("/login");
	};

	return (
		<div className="bg-dark text-white p-4 shadow-lg">
			<div className="container mx-auto flex justify-between items-center">
				<div className="text-xl font-bold">
					<Link to="/">
						<img className="h-14 w-14" src={logo} alt="ScrumHub Logo" />
					</Link>
				</div>

				<div className="hidden md:flex space-x-6">
					{user &&
						user.role === "SCRUM_MASTER" &&
						<div className="flex space-x-6">
							<Link
								to="/dashboard"
								className="hover:text-primary transition-colors">
								Dashboard
							</Link>
							<Link to="/" className="hover:text-primary transition-colors">
								Home
							</Link>
						</div>}

					{user &&
						user.role === "DEVELOPER" &&
						<div>
							<Link
								to="/tasks"
								className="hover:text-primary transition-colors">
								My Tasks
							</Link>
						</div>}
				</div>

				<div className="hidden md:flex items-center space-x-4 ml-6">
					{user &&
						<div className="flex items-center space-x-4">
							<div>
								<Link
									to="/profile"
									className="hover:text-primary transition-colors">
									<User size={20} />
								</Link>
							</div>
							{user.role === "SCRUM_MASTER" &&
								<div>
									<Link
										to="/create-project"
										className="bg-primary hover:bg-accent px-4 py-2 rounded-md flex items-center transition-colors">
										<PlusCircle size={18} className="mr-1" />
										<span>New Project</span>
									</Link>
								</div>}
							<div>
								<button
									onClick={handleLogout}
									className="bg-white text-dark border border-primary hover:bg-light px-4 py-2 rounded-md transition-colors">
									Logout
								</button>
							</div>
						</div>}

					{!user &&
						!loading &&
						<div>
							<Link
								to="/login"
								className="bg-primary hover:bg-accent px-4 py-2 rounded-md transition-colors">
								Login
							</Link>
						</div>}
				</div>

				<div className="md:hidden">
					<button onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>
			</div>

			{isOpen &&
				<div className="md:hidden flex flex-col items-center space-y-4 mt-4">
					{user &&
						user.role === "SCRUM_MASTER" &&
						<div className="flex flex-col items-center space-y-4 w-full">
							<Link
								to="/dashboard"
								className="hover:text-primary transition-colors">
								Dashboard
							</Link>
							<Link to="/" className="hover:text-primary transition-colors">
								Home
							</Link>
						</div>}

					{user &&
						user.role === "DEVELOPER" &&
						<div className="w-full text-center">
							<Link
								to="/tasks"
								className="hover:text-primary transition-colors">
								My Tasks
							</Link>
						</div>}

					{user &&
						<div className="flex flex-col items-center space-y-4 w-full">
							<Link
								to="/profile"
								className="hover:text-primary transition-colors">
								<User size={20} className="inline-block" />
								<span className="ml-1">Profile</span>
							</Link>

							{user.role === "SCRUM_MASTER" &&
								<Link
									to="/create-project"
									className="bg-primary hover:bg-accent px-4 py-2 rounded-md w-full text-center transition-colors flex items-center justify-center">
									<PlusCircle size={18} className="mr-1" />
									<span>New Project</span>
								</Link>}

							<button
								onClick={handleLogout}
								className="bg-white text-dark border border-primary hover:bg-light px-4 py-2 rounded-md w-full transition-colors">
								Logout
							</button>
						</div>}

					{!user &&
						!loading &&
						<div className="w-full">
							<Link
								to="/login"
								className="bg-primary hover:bg-accent px-4 py-2 rounded-md w-full text-center transition-colors block">
								Login
							</Link>
						</div>}
				</div>}
		</div>
	);
}

export default Navbar;
