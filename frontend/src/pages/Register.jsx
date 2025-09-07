import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import axios from "axios";
import { CheckCircle } from "lucide-react";

function Register() {
	const [formData, setFormData] = useState({
		name: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "DEVELOPER" 
	});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(
		() => {
			const token = localStorage.getItem("token");
			if (token) {
				navigate("/dashboard");
			}
		},
		[navigate]
	);

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	const validateForm = () => {
		const { name, lastName, email, password, confirmPassword } = formData;

		if (!name.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
			setError("All fields are required");
			return false;
		}

		const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!emailPattern.test(email)) {
			setError("Please enter a valid email address");
			return false;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters long");
			return false;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return false;
		}

		return true;
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setError("");

		if (!validateForm()) return;

		setIsLoading(true);

		try {
			console.log("Attempting registration with data:", {
				name: formData.name,
				lastName: formData.lastName,
				email: formData.email,
				role: formData.role
			});

			const response = await axios.post(
				"/api/auth/register",
				{
					name: formData.name,
					lastName: formData.lastName,
					email: formData.email,
					password: formData.password,
					role: formData.role
				}
			);

			console.log("Registration response:", response);
			setIsLoading(false);

			if (response.status === 201) {
				console.log("Registration successful, navigating to login");
				navigate("/login");
			}
		} catch (err) {
			console.error("Registration error:", err);
			console.error("Error response:", err.response);
			setIsLoading(false);
			if (err.response?.data?.message) {
				setError(err.response.data.message);
			} else {
				setError(`Registration failed: ${err.message || 'Please try again later.'}`);
			}
		}
	};

	return (
		<div className="flex h-screen bg-gradient-to-br from-light to-white">
			<div className="m-auto bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl">
				<div className="flex flex-col md:flex-row">
					<div className="w-full md:w-1/2 p-8">
						<div className="flex justify-center mb-8">
							<div className="w-16 h-16 bg-primary flex items-center justify-center text-white text-2xl font-bold rounded-lg">
								SH
							</div>
						</div>

						<h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
							Create Your ScrumHub Account
						</h1>

						{error &&
							<div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
								{error}
							</div>}

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="name"
										className="block text-gray-700 font-medium mb-1">
										First Name
									</label>
									<input
										id="name"
										name="name"
										type="text"
										value={formData.name}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
										placeholder="John"
									/>
								</div>

								<div>
									<label
										htmlFor="lastName"
										className="block text-gray-700 font-medium mb-1">
										Last Name
									</label>
									<input
										id="lastName"
										name="lastName"
										type="text"
										value={formData.lastName}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
										placeholder="Doe"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="email"
									className="block text-gray-700 font-medium mb-1">
									Email
								</label>
								<input
									id="email"
									name="email"
									type="email"
									value={formData.email}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
									placeholder="john.doe@example.com"
								/>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-gray-700 font-medium mb-1">
									Password
								</label>
								<input
									id="password"
									name="password"
									type="password"
									value={formData.password}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
									placeholder="••••••••"
								/>
							</div>

							<div>
								<label
									htmlFor="confirmPassword"
									className="block text-gray-700 font-medium mb-1">
									Confirm Password
								</label>
								<input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									value={formData.confirmPassword}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
									placeholder="••••••••"
								/>
							</div>

							<div>
								<label
									htmlFor="role"
									className="block text-gray-700 font-medium mb-1">
									Role
								</label>
								<select
									id="role"
									name="role"
									value={formData.role}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors">
									<option value="GUEST">Guest</option>
									<option value="DEVELOPER">Developer</option>
									<option value="TESTER">Tester</option>
									<option value="SCRUM_MASTER">Scrum Master</option>
								</select>
							</div>

							<button
								type="submit"
								disabled={isLoading}
								className="w-full bg-primary text-white py-3 rounded-lg hover:bg-accent transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed">
								{isLoading ? "Creating account..." : "Create Account"}
							</button>
						</form>

						<div className="relative my-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">
									Or continue with
								</span>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<button className="flex items-center justify-center border border-gray-300 p-2 rounded-lg hover:bg-gray-50 transition-colors">
								<FcGoogle className="mr-2 text-lg" />
								<span>Google</span>
							</button>
							<button className="flex items-center justify-center border border-gray-300 p-2 rounded-lg hover:bg-gray-50 transition-colors">
								<FaGithub className="mr-2 text-lg" />
								<span>GitHub</span>
							</button>
						</div>

						<p className="text-center text-gray-600 mt-8">
							Already have an account?{" "}
							<Link
								to="/login"
								className="text-primary font-medium hover:text-accent">
								Sign in
							</Link>
						</p>
					</div>

					<div className="hidden md:block w-1/2 bg-gradient-to-br from-primary to-dark p-12 text-white">
						<h2 className="text-3xl font-bold mb-6">Welcome to ScrumHub!</h2>
						<p className="mb-8">
							Join our platform to manage your Scrum projects efficiently with
							features designed specifically for agile teams.
						</p>

						<div className="space-y-4">
							<div className="flex items-center">
								<div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
									<CheckCircle className="h-4 w-4" />
								</div>
								<span>Role-based access control</span>
							</div>

							<div className="flex items-center">
								<div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
									<CheckCircle className="h-4 w-4" />
								</div>
								<span>Sprint and backlog management</span>
							</div>

							<div className="flex items-center">
								<div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
									<CheckCircle className="h-4 w-4" />
								</div>
								<span>Comprehensive reporting and analytics</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Register;
