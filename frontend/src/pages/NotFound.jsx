import React from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
	const goBack = () => {
		window.history.back();
	};

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			{/* Navbar Placeholder */}
			<div className="bg-gray-800 text-white p-4 shadow-lg">
				<div className="container mx-auto">
					<Link to="/" className="text-xl font-bold hover:text-blue-300">
						ScrumHub
					</Link>
				</div>
			</div>

			<main className="flex-grow flex items-center justify-center px-4">
				<div className="text-center max-w-md mx-auto">
					{/* 404 Illustration */}
					<div className="mb-8">
						<div className="text-9xl font-bold text-blue-600 mb-4">404</div>
						<div className="w-24 h-1 bg-blue-600 mx-auto mb-8" />
					</div>

					{/* Error Message */}
					<h1 className="text-3xl font-bold text-gray-900 mb-4">
						Page Not Found
					</h1>
					<p className="text-gray-600 mb-8 leading-relaxed">
						Sorry, the page you are looking for doesn't exist or has been moved.
						Let's get you back on track.
					</p>

					{/* Action Buttons */}
					<div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
						<button
							onClick={goBack}
							className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Go Back
						</button>

						<Link
							to="/"
							className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
							<Home className="w-4 h-4 mr-2" />
							Go Home
						</Link>
					</div>

					{/* Additional Help */}
					<div className="mt-12 pt-8 border-t border-gray-200">
						<p className="text-sm text-gray-500 mb-4">
							Need help? Here are some quick links:
						</p>
						<div className="flex flex-wrap justify-center gap-4 text-sm">
							<Link to="/login" className="text-blue-600 hover:text-blue-800">
								Login
							</Link>
							<Link
								to="/register"
								className="text-blue-600 hover:text-blue-800">
								Sign Up
							</Link>
							<Link to="/" className="text-blue-600 hover:text-blue-800">
								Home Page
							</Link>
						</div>
					</div>
				</div>
			</main>

			{/* Footer Placeholder */}
			<footer className="bg-gray-800 text-white py-6">
				<div className="container mx-auto px-6 text-center">
					<p className="text-sm">© 2025 ScrumHub. All Rights Reserved.</p>
				</div>
			</footer>
		</div>
	);
};

export default NotFound;
