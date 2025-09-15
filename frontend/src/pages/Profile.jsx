import React, { useState, useEffect } from "react";
import { User, Save, Lock, BarChart3, Activity, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const ProfilePage = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [activeTab, setActiveTab] = useState("profile");
	const [userStats, setUserStats] = useState(null);
	const [userActivity, setUserActivity] = useState(null);
	const [showPasswordForm, setShowPasswordForm] = useState(false);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		role: ""
	});

	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmNewPassword: ""
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
					username: response.data.username || "",
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

	const fetchUserStats = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get(
				"http://localhost:8080/api/user/statistics",
				{
					headers: { Authorization: `Bearer ${token}` }
				}
			);
			setUserStats(response.data);
		} catch (error) {
			console.error("Error fetching user stats:", error);
		}
	};

	const fetchUserActivity = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get(
				"http://localhost:8080/api/user/activity",
				{
					headers: { Authorization: `Bearer ${token}` }
				}
			);
			setUserActivity(response.data);
		} catch (error) {
			console.error("Error fetching user activity:", error);
		}
	};

	const handleSave = async e => {
		e.preventDefault();
		try {
			const token = localStorage.getItem("token");
			const updateData = {
				fullName: formData.fullName,
				username: formData.username
			};
			const response = await axios.put("http://localhost:8080/api/user/profile", updateData, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setUser(response.data);
			setIsEditing(false);
			setSuccessMessage("Profile updated successfully!");
			setTimeout(() => setSuccessMessage(""), 3000);
		} catch (error) {
			console.error("Error updating profile:", error);
			setErrorMessage("Failed to update profile. Please try again.");
			setTimeout(() => setErrorMessage(""), 3000);
		}
	};

	const handlePasswordChange = async e => {
		e.preventDefault();
		if (passwordData.newPassword !== passwordData.confirmNewPassword) {
			setErrorMessage("New passwords do not match!");
			setTimeout(() => setErrorMessage(""), 3000);
			return;
		}

		try {
			const token = localStorage.getItem("token");
			await axios.post("http://localhost:8080/api/user/change-password", passwordData, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setPasswordData({
				currentPassword: "",
				newPassword: "",
				confirmNewPassword: ""
			});
			setShowPasswordForm(false);
			setSuccessMessage("Password changed successfully!");
			setTimeout(() => setSuccessMessage(""), 3000);
		} catch (error) {
			console.error("Error changing password:", error);
			setErrorMessage(error.response?.data || "Failed to change password. Please try again.");
			setTimeout(() => setErrorMessage(""), 3000);
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
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-6">
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
						</div>

						{/* Success/Error Messages */}
						{successMessage && (
							<div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
								{successMessage}
							</div>
						)}
						{errorMessage && (
							<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
								{errorMessage}
							</div>
						)}

						{/* Tabs */}
						<div className="flex space-x-6 border-b">
							<button
								onClick={() => setActiveTab("profile")}
								className={`py-2 px-4 font-medium ${
									activeTab === "profile"
										? "text-blue-600 border-b-2 border-blue-600"
										: "text-gray-600 hover:text-gray-900"
								}`}>
								<User className="w-4 h-4 inline mr-2" />
								Profile
							</button>
							<button
								onClick={() => {
									setActiveTab("statistics");
									if (!userStats) fetchUserStats();
								}}
								className={`py-2 px-4 font-medium ${
									activeTab === "statistics"
										? "text-blue-600 border-b-2 border-blue-600"
										: "text-gray-600 hover:text-gray-900"
								}`}>
								<BarChart3 className="w-4 h-4 inline mr-2" />
								Statistics
							</button>
							<button
								onClick={() => {
									setActiveTab("activity");
									if (!userActivity) fetchUserActivity();
								}}
								className={`py-2 px-4 font-medium ${
									activeTab === "activity"
										? "text-blue-600 border-b-2 border-blue-600"
										: "text-gray-600 hover:text-gray-900"
								}`}>
								<Activity className="w-4 h-4 inline mr-2" />
								Activity
							</button>
							<button
								onClick={() => setActiveTab("security")}
								className={`py-2 px-4 font-medium ${
									activeTab === "security"
										? "text-blue-600 border-b-2 border-blue-600"
										: "text-gray-600 hover:text-gray-900"
								}`}>
								<Lock className="w-4 h-4 inline mr-2" />
								Security
							</button>
						</div>
					</div>

					{/* Tab Content */}
					<div className="bg-white rounded-xl shadow-sm p-8">
						{activeTab === "profile" && (
							<div>
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
									<button
										onClick={() => setIsEditing(!isEditing)}
										className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
										{isEditing ? "Cancel" : "Edit Profile"}
									</button>
								</div>

								<div className="space-y-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Username
										</label>
										<input
											type="text"
											value={formData.username}
											onChange={e =>
												setFormData({ ...formData, username: e.target.value })}
											disabled={!isEditing}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
										/>
									</div>

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
											disabled={true}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
										/>
										<p className="text-sm text-gray-500 mt-1">
											Email cannot be changed
										</p>
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

									{isEditing && (
										<div className="flex space-x-4">
											<button
												onClick={handleSave}
												className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
												<Save className="w-4 h-4 mr-2" />
												Save Changes
											</button>
										</div>
									)}
								</div>
							</div>
						)}

						{activeTab === "statistics" && (
							<div>
								<h2 className="text-xl font-semibold text-gray-900 mb-6">User Statistics</h2>
								{userStats ? (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										<div className="bg-blue-50 p-4 rounded-lg">
											<h3 className="font-medium text-blue-900">Total Tasks</h3>
											<p className="text-2xl font-bold text-blue-600">{userStats.totalAssignedTasks}</p>
										</div>
										<div className="bg-green-50 p-4 rounded-lg">
											<h3 className="font-medium text-green-900">Completed Tasks</h3>
											<p className="text-2xl font-bold text-green-600">{userStats.completedTasks}</p>
										</div>
										<div className="bg-yellow-50 p-4 rounded-lg">
											<h3 className="font-medium text-yellow-900">Active Tasks</h3>
											<p className="text-2xl font-bold text-yellow-600">{userStats.activeTasks}</p>
										</div>
										<div className="bg-purple-50 p-4 rounded-lg">
											<h3 className="font-medium text-purple-900">Projects Joined</h3>
											<p className="text-2xl font-bold text-purple-600">{userStats.totalProjectsJoined}</p>
										</div>
										<div className="bg-indigo-50 p-4 rounded-lg">
											<h3 className="font-medium text-indigo-900">Comments Posted</h3>
											<p className="text-2xl font-bold text-indigo-600">{userStats.totalCommentsPosted}</p>
										</div>
										<div className="bg-pink-50 p-4 rounded-lg">
											<h3 className="font-medium text-pink-900">Time Logged (mins)</h3>
											<p className="text-2xl font-bold text-pink-600">{userStats.totalTimeLogged}</p>
										</div>
										<div className="bg-red-50 p-4 rounded-lg">
											<h3 className="font-medium text-red-900">Bugs Reported</h3>
											<p className="text-2xl font-bold text-red-600">{userStats.totalBugsReported}</p>
										</div>
										<div className="bg-orange-50 p-4 rounded-lg">
											<h3 className="font-medium text-orange-900">Bugs Assigned</h3>
											<p className="text-2xl font-bold text-orange-600">{userStats.totalBugsAssigned}</p>
										</div>
										<div className="bg-teal-50 p-4 rounded-lg">
											<h3 className="font-medium text-teal-900">Test Cases Created</h3>
											<p className="text-2xl font-bold text-teal-600">{userStats.totalTestCasesCreated}</p>
										</div>
									</div>
								) : (
									<div className="flex items-center justify-center py-8">
										<div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600" />
									</div>
								)}
							</div>
						)}

						{activeTab === "activity" && (
							<div>
								<h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
								{userActivity ? (
									<div className="space-y-6">
										<div>
											<h3 className="text-lg font-medium text-gray-900 mb-3">Recent Tasks</h3>
											<div className="space-y-2">
												{userActivity.recentTasks?.length > 0 ? (
													userActivity.recentTasks.map((task, index) => (
														<div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
															<div>
																<p className="font-medium">{task.title}</p>
																<p className="text-sm text-gray-500">Status: {task.status}</p>
															</div>
															<p className="text-xs text-gray-400">{new Date(task.createdAt).toLocaleDateString()}</p>
														</div>
													))
												) : (
													<p className="text-gray-500">No recent tasks</p>
												)}
											</div>
										</div>

										<div>
											<h3 className="text-lg font-medium text-gray-900 mb-3">Recent Comments</h3>
											<div className="space-y-2">
												{userActivity.recentComments?.length > 0 ? (
													userActivity.recentComments.map((comment, index) => (
														<div key={index} className="p-3 bg-gray-50 rounded-lg">
															<p className="text-sm">{comment.content}</p>
															<p className="text-xs text-gray-400 mt-1">Task ID: {comment.taskId} • {new Date(comment.createdAt).toLocaleDateString()}</p>
														</div>
													))
												) : (
													<p className="text-gray-500">No recent comments</p>
												)}
											</div>
										</div>

										<div>
											<h3 className="text-lg font-medium text-gray-900 mb-3">Recent Time Logs</h3>
											<div className="space-y-2">
												{userActivity.recentTimeLogs?.length > 0 ? (
													userActivity.recentTimeLogs.map((timeLog, index) => (
														<div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
															<div>
																<p className="font-medium">{timeLog.description}</p>
																<p className="text-sm text-gray-500">{timeLog.hours} hours</p>
															</div>
															<p className="text-xs text-gray-400">{new Date(timeLog.workDate).toLocaleDateString()}</p>
														</div>
													))
												) : (
													<p className="text-gray-500">No recent time logs</p>
												)}
											</div>
										</div>
									</div>
								) : (
									<div className="flex items-center justify-center py-8">
										<div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600" />
									</div>
								)}
							</div>
						)}

						{activeTab === "security" && (
							<div>
								<h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>

								<div className="space-y-6">
									<div className="flex items-center justify-between p-4 border rounded-lg">
										<div>
											<h3 className="font-medium text-gray-900">Password</h3>
											<p className="text-sm text-gray-500">Update your password to keep your account secure</p>
										</div>
										<button
											onClick={() => setShowPasswordForm(!showPasswordForm)}
											className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
											Change Password
										</button>
									</div>

									{showPasswordForm && (
										<form onSubmit={handlePasswordChange} className="space-y-4 p-4 border rounded-lg bg-gray-50">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Current Password
												</label>
												<div className="relative">
													<input
														type={showCurrentPassword ? "text" : "password"}
														value={passwordData.currentPassword}
														onChange={e =>
															setPasswordData({ ...passwordData, currentPassword: e.target.value })}
														required
														className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
													/>
													<button
														type="button"
														onClick={() => setShowCurrentPassword(!showCurrentPassword)}
														className="absolute inset-y-0 right-0 pr-3 flex items-center">
														{showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
													</button>
												</div>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													New Password
												</label>
												<div className="relative">
													<input
														type={showNewPassword ? "text" : "password"}
														value={passwordData.newPassword}
														onChange={e =>
															setPasswordData({ ...passwordData, newPassword: e.target.value })}
														required
														minLength="8"
														className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
													/>
													<button
														type="button"
														onClick={() => setShowNewPassword(!showNewPassword)}
														className="absolute inset-y-0 right-0 pr-3 flex items-center">
														{showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
													</button>
												</div>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Confirm New Password
												</label>
												<div className="relative">
													<input
														type={showConfirmPassword ? "text" : "password"}
														value={passwordData.confirmNewPassword}
														onChange={e =>
															setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
														required
														className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
													/>
													<button
														type="button"
														onClick={() => setShowConfirmPassword(!showConfirmPassword)}
														className="absolute inset-y-0 right-0 pr-3 flex items-center">
														{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
													</button>
												</div>
											</div>

											<div className="flex space-x-4">
												<button
													type="submit"
													className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
													Update Password
												</button>
												<button
													type="button"
													onClick={() => {
														setShowPasswordForm(false);
														setPasswordData({
															currentPassword: "",
															newPassword: "",
															confirmNewPassword: ""
														});
													}}
													className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
													Cancel
												</button>
											</div>
										</form>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default ProfilePage;
