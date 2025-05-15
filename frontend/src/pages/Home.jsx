import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin } from "lucide-react";
import { FaCheck, FaUsersCog, FaChartLine, FaTasks } from "react-icons/fa";
import { BsKanban, BsCalendarCheck } from "react-icons/bs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<Navbar />
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
			// ose ti bejm replace me footerin e krijuar ne components ose mbajme kete
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
										<Link
											to="/features"
											className="text-gray-400 hover:text-white">
											Features
										</Link>
									</li>
									<li>
										<Link
											to="/pricing"
											className="text-gray-400 hover:text-white">
											Pricing
										</Link>
									</li>
									<li>
										<Link
											to="/integrations"
											className="text-gray-400 hover:text-white">
											Integrations
										</Link>
									</li>
									<li>
										<Link
											to="/roadmap"
											className="text-gray-400 hover:text-white">
											Roadmap
										</Link>
									</li>
								</ul>
							</div>

							<div>
								<h4 className="text-lg font-bold mb-4">Resources</h4>
								<ul className="space-y-2">
									<li>
										<Link to="/docs" className="text-gray-400 hover:text-white">
											Documentation
										</Link>
									</li>
									<li>
										<Link to="/blog" className="text-gray-400 hover:text-white">
											Blog
										</Link>
									</li>
									<li>
										<Link
											to="/community"
											className="text-gray-400 hover:text-white">
											Community
										</Link>
									</li>
									<li>
										<Link
											to="/support"
											className="text-gray-400 hover:text-white">
											Support
										</Link>
									</li>
								</ul>
							</div>

							<div>
								<h4 className="text-lg font-bold mb-4">Company</h4>
								<ul className="space-y-2">
									<li>
										<Link
											to="/about"
											className="text-gray-400 hover:text-white">
											About Us
										</Link>
									</li>
									<li>
										<Link
											to="/careers"
											className="text-gray-400 hover:text-white">
											Careers
										</Link>
									</li>
									<li>
										<Link
											to="/contact"
											className="text-gray-400 hover:text-white">
											Contact
										</Link>
									</li>
									<li>
										<Link
											to="/privacy"
											className="text-gray-400 hover:text-white">
											Privacy
										</Link>
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
							<Link to="#" className="text-gray-400 hover:text-white">
								<span className="sr-only">Twitter</span>
								<Twitter className="h-6 w-6" />
							</Link>
							<Link to="#" className="text-gray-400 hover:text-white">
								<span className="sr-only">GitHub</span>
								<Github className="h-6 w-6" />
							</Link>
							<Link to="#" className="text-gray-400 hover:text-white">
								<span className="sr-only">LinkedIn</span>
								<Linkedin className="h-6 w-6" />
							</Link>
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
