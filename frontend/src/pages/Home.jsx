import React from "react";
import { Link } from "react-router-dom";
import { FaCheck, FaUsersCog, FaChartLine, FaTasks } from "react-icons/fa";
import { BsKanban, BsCalendarCheck } from "react-icons/bs";

function Home() {
	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<header className="bg-gradient-to-r from-primary to-dark text-white">
				<div className="container mx-auto px-6 py-16 flex flex-col items-center">
					<h1 className="text-5xl font-bold text-center mb-6">ScrumHub</h1>
					<p className="text-xl text-center mb-10 max-w-2xl">
						The modern Scrum project management tool designed to help teams
						deliver value through collaboration and transparency
					</p>
					<div className="flex flex-col sm:flex-row gap-4">
						<Link
							to="/register"
							className="bg-white text-primary font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300">
							Get Started Free
						</Link>
						<Link
							to="/login"
							className="bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white hover:text-primary transition duration-300">
							Sign In
						</Link>
					</div>
				</div>
			</header>

			<section className="py-20 bg-white">
				<div className="container mx-auto px-6">
					<h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
						Everything your Scrum team needs
					</h2>

					<div className="grid md:grid-cols-3 gap-10">
						<FeatureCard
							icon={<BsKanban className="text-4xl text-primary" />}
							title="Intuitive Boards"
							description="Visualize your sprints with customizable Kanban boards that make tracking progress effortless."
						/>
						<FeatureCard
							icon={<FaTasks className="text-4xl text-primary" />}
							title="Backlog Management"
							description="Organize your product backlog with powerful filtering, tagging, and prioritization tools."
						/>
						<FeatureCard
							icon={<BsCalendarCheck className="text-4xl text-primary" />}
							title="Sprint Planning"
							description="Plan and manage sprints with capacity tracking, burndown charts, and goal setting."
						/>
						<FeatureCard
							icon={<FaUsersCog className="text-4xl text-primary" />}
							title="Team Management"
							description="Assign roles, track capacity, and manage team members with role-based permissions."
						/>
						<FeatureCard
							icon={<FaChartLine className="text-4xl text-primary" />}
							title="Analytics & Reports"
							description="Make data-driven decisions with comprehensive reports on velocity, burndown, and team performance."
						/>
						<FeatureCard
							icon={<FaCheck className="text-4xl text-primary" />}
							title="Scrum Ceremonies"
							description="Streamline planning, stand-ups, reviews, and retrospectives with built-in ceremony support."
						/>
					</div>
				</div>
			</section>

			<section className="py-20 bg-gray-50">
				<div className="container mx-auto px-6">
					<h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
						How ScrumHub Works
					</h2>

					<div className="flex flex-col md:flex-row gap-6 justify-center items-center">
						<div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
							<div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full text-white font-bold mb-6">
								1
							</div>
							<h3 className="text-xl font-bold mb-3 text-gray-800">
								Create Your Project
							</h3>
							<p className="text-gray-600">
								Set up your project in minutes, customize workflows, and invite
								your team members.
							</p>
						</div>

						<div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
							<div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full text-white font-bold mb-6">
								2
							</div>
							<h3 className="text-xl font-bold mb-3 text-gray-800">
								Plan Your Sprint
							</h3>
							<p className="text-gray-600">
								Build your backlog, prioritize stories, plan capacity, and set
								sprint goals.
							</p>
						</div>

						<div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
							<div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full text-white font-bold mb-6">
								3
							</div>
							<h3 className="text-xl font-bold mb-3 text-gray-800">
								Execute & Improve
							</h3>
							<p className="text-gray-600">
								Track progress with real-time updates, analyze performance, and
								continuously improve.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="py-20 bg-white">
				<div className="container mx-auto px-6">
					<h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
						Tailored for Every Role
					</h2>
					<p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
						ScrumHub provides specialized features for each member of your Scrum
						team
					</p>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						<RoleCard
							title="Scrum Masters"
							features={[
								"Ceremony facilitation",
								"Team performance metrics",
								"Impediment tracking",
								"Sprint management"
							]}
							color="bg-primary"
						/>
						<RoleCard
							title="Developers"
							features={[
								"Task management",
								"Time tracking",
								"Code integration",
								"Technical documentation"
							]}
							color="bg-secondary"
						/>
						<RoleCard
							title="Testers"
							features={[
								"Test case management",
								"Defect tracking",
								"Test coverage reports",
								"Quality metrics"
							]}
							color="bg-accent"
						/>
						<RoleCard
							title="Guests"
							features={[
								"View project progress",
								"Access public dashboards",
								"View basic project info",
								"Follow sprint progress"
							]}
							color="bg-dark"
						/>
					</div>
				</div>
			</section>

			<section className="py-20 bg-gradient-to-r from-primary to-dark text-white">
				<div className="container mx-auto px-6 text-center">
					<h2 className="text-3xl font-bold mb-6">
						Ready to transform your Scrum process?
					</h2>
					<p className="mb-10 max-w-2xl mx-auto text-lg">
						Join thousands of teams who deliver better products, faster with
						ScrumHub.
					</p>
					<Link
						to="/register"
						className="bg-white text-primary font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300">
						Start Your Free Trial
					</Link>
				</div>
			</section>

			<footer className="bg-gray-800 text-white py-12">
				<div className="container mx-auto px-6">
					<div className="flex flex-col md:flex-row justify-between">
						<div className="mb-6 md:mb-0">
							<h3 className="text-2xl font-bold mb-4">ScrumHub</h3>
							<p className="text-gray-400 max-w-sm">
								The modern Scrum project management tool for agile teams.
							</p>
						</div>

						<div className="grid grid-cols-2 md:grid-cols-3 gap-8">
							<div>
								<h4 className="text-lg font-bold mb-4">Product</h4>
								<ul className="space-y-2">
									<li>
										<a href="#" className="text-gray-400 hover:text-white">
											Features
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-400 hover:text-white">
											Pricing
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-400 hover:text-white">
											Integrations
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-400 hover:text-white">
											Roadmap
										</a>
									</li>
								</ul>
							</div>

							<div>
								<h4 className="text-lg font-bold mb-4">Resources</h4>
								<ul className="space-y-2">
									<li>
										<a href="#" className="text-gray-400 hover:text-white">
											Documentation
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-400 hover:text-white">
											Blog
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-400 hover:text-white">
											Community
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-400 hover:text-white">
											Support
										</a>
									</li>
								</ul>
							</div>

							<div>
								<h4 className="text-lg font-bold mb-4">Company</h4>
								<ul className="space-y-2">
									<li>
										<a href="#" className="text-gray-400 hover:text-white">
											About Us
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-400 hover:text-white">
											Careers
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-400 hover:text-white">
											Contact
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-400 hover:text-white">
											Privacy
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
						<p className="text-gray-400">
							© 2024 ScrumHub. All rights reserved.
						</p>
						<div className="flex space-x-4 mt-4 md:mt-0">
							<a href="#" className="text-gray-400 hover:text-white">
								<span className="sr-only">Twitter</span>
								<svg
									className="h-6 w-6"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true">
									<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
								</svg>
							</a>
							<a href="#" className="text-gray-400 hover:text-white">
								<span className="sr-only">GitHub</span>
								<svg
									className="h-6 w-6"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true">
									<path
										fillRule="evenodd"
										d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
										clipRule="evenodd"
									/>
								</svg>
							</a>
							<a href="#" className="text-gray-400 hover:text-white">
								<span className="sr-only">LinkedIn</span>
								<svg
									className="h-6 w-6"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true">
									<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
								</svg>
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

const FeatureCard = ({ icon, title, description }) =>
	<div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition duration-300 flex flex-col items-center text-center">
		<div className="mb-4">
			{icon}
		</div>
		<h3 className="text-xl font-bold mb-2 text-gray-800">
			{title}
		</h3>
		<p className="text-gray-600">
			{description}
		</p>
	</div>;

const RoleCard = ({ title, features, color }) =>
	<div className="rounded-lg shadow-md overflow-hidden">
		<div className={`${color} p-4 text-white`}>
			<h3 className="text-xl font-bold">
				{title}
			</h3>
		</div>
		<div className="bg-white p-6">
			<ul className="space-y-2">
				{features.map((feature, index) =>
					<li key={index} className="flex items-start">
						<FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
						<span>
							{feature}
						</span>
					</li>
				)}
			</ul>
		</div>
	</div>;

export default Home;
