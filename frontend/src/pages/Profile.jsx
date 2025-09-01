import React, { useState, useEffect } from "react";
import { User, Save } from "lucide-react";
import axios from "axios";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const ProfilePage = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		role: ""
	});

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(
					"http://localhost:8080/api/user/profile",
					{
						headers: { Authorization: `Bearer ${token}` }
					}
				);
				setUser(response.data);
				setFormData({
					fullName: response.data.fullName || "",
					email: response.data.email || "",
					role: response.data.role || ""
				});
				setLoading(false);
			} catch (error) {
				console.error("Error fetching profile:", error);
				setLoading(false);
			}
		};

		fetchProfile();
	}, []);

	const handleSave = async e => {
		e.preventDefault();
		try {
			const token = localStorage.getItem("token");
			await axios.put("http://localhost:8080/api/user/profile", formData, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setIsEditing(false);
			// TODO: Show success message
		} catch (error) {
			console.error("Error updating profile:", error);
			// TODO: Show error message
		}
	};

	if (loading)
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600" />
			</div>
		);

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<Navbar />
			<main className="flex-grow container mx-auto px-4 py-8">
				<div className="max-w-2xl mx-auto">
					<div className="bg-white rounded-xl shadow-sm p-8">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center space-x-3">
								<div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
									<User className="w-6 h-6 text-white" />
								</div>
								<div>
									<h1 className="text-2xl font-bold text-gray-900">
										User Profile
									</h1>
									<p className="text-gray-600">
										Manage your account information
									</p>
								</div>
							</div>
							<button
								onClick={() => setIsEditing(!isEditing)}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
								{isEditing ? "Cancel" : "Edit Profile"}
							</button>
						</div>

						<div className="space-y-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Full Name
								</label>
								<input
									type="text"
									value={formData.fullName}
									onChange={e =>
										setFormData({ ...formData, fullName: e.target.value })}
									disabled={!isEditing}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Email
								</label>
								<input
									type="email"
									value={formData.email}
									onChange={e =>
										setFormData({ ...formData, email: e.target.value })}
									disabled={!isEditing}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Role
								</label>
								<input
									type="text"
									value={formData.role}
									disabled={true}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
								/>
								<p className="text-sm text-gray-500 mt-1">
									Role cannot be changed
								</p>
							</div>

							{isEditing &&
								<div className="flex space-x-4">
									<button
										onClick={handleSave}
										className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
										<Save className="w-4 h-4 mr-2" />
										Save Changes
									</button>
								</div>}
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default ProfilePage;
