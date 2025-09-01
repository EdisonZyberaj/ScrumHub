import React, { useState } from "react";
import { Settings, Save } from "lucide-react";
import axios from "axios";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const SettingsPage = () => {
	const [settings, setSettings] = useState({
		notifications: true,
		emailAlerts: false,
		theme: "light"
	});

	const handleSettingChange = (key, value) => {
		setSettings(prev => ({
			...prev,
			[key]: value
		}));
	};

	const handleSave = async () => {
		try {
			const token = localStorage.getItem("token");
			// TODO: Uncomment when backend endpoint is ready
			// await axios.put('http://localhost:8080/api/user/settings', settings, {
			//   headers: { Authorization: `Bearer ${token}` }
			// });
			console.log("Settings saved successfully", settings);
			// TODO: Show success message
		} catch (error) {
			console.error("Error saving settings:", error);
			// TODO: Show error message
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<Navbar />
			<main className="flex-grow container mx-auto px-4 py-8">
				<div className="max-w-2xl mx-auto">
					<div className="bg-white rounded-xl shadow-sm p-8">
						<div className="flex items-center space-x-3 mb-6">
							<div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
								<Settings className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-gray-900">Settings</h1>
								<p className="text-gray-600">
									Customize your ScrumHub experience
								</p>
							</div>
						</div>

						<div className="space-y-6">
							<div>
								<h3 className="text-lg font-medium text-gray-900 mb-4">
									Notifications
								</h3>
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div>
											<label className="text-sm font-medium text-gray-700">
												Push Notifications
											</label>
											<p className="text-sm text-gray-500">
												Receive notifications in the app
											</p>
										</div>
										<label className="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												checked={settings.notifications}
												onChange={e =>
													handleSettingChange(
														"notifications",
														e.target.checked
													)}
												className="sr-only peer"
											/>
											<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
										</label>
									</div>

									<div className="flex items-center justify-between">
										<div>
											<label className="text-sm font-medium text-gray-700">
												Email Alerts
											</label>
											<p className="text-sm text-gray-500">
												Receive email notifications
											</p>
										</div>
										<label className="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												checked={settings.emailAlerts}
												onChange={e =>
													handleSettingChange("emailAlerts", e.target.checked)}
												className="sr-only peer"
											/>
											<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
										</label>
									</div>
								</div>
							</div>

							<div>
								<h3 className="text-lg font-medium text-gray-900 mb-4">
									Appearance
								</h3>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Theme
									</label>
									<select
										value={settings.theme}
										onChange={e => handleSettingChange("theme", e.target.value)}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
										<option value="light">Light</option>
										<option value="dark">Dark</option>
										<option value="auto">Auto</option>
									</select>
								</div>
							</div>

							<div className="pt-6 border-t border-gray-200">
								<button
									onClick={handleSave}
									className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
									<Save className="w-4 h-4 mr-2" />
									Save Settings
								</button>
							</div>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default SettingsPage;
