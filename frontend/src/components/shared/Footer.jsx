import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Linkedin, Twitter, Instagram } from "lucide-react";
import logo from "../../assets/logo.png";

function Footer() {
	const navigate = useNavigate();
	const location = useLocation();
	const handleHowItWorksClick = e => {
		e.preventDefault();

		if (location.pathname === "/") {
			const section = document.getElementById("how-it-works");
			if (section) {
				section.scrollIntoView({ behavior: "smooth" });
			}
		} else {
			navigate("/");
			setTimeout(() => {
				const section = document.getElementById("how-it-works");
				if (section) {
					section.scrollIntoView({ behavior: "smooth" });
				}
			}, 300);
		}
	};

	return (
		<footer className="bg-dark text-white py-12">
			<div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
				<div>
					<div className="flex items-center mb-4">
						<img src={logo} alt="ScrumHub Logo" className="h-10 mr-3" />
						<h3 className="text-xl font-bold">ScrumHub</h3>
					</div>
					<p className="text-sm text-gray-300">
						Efficient project management for agile teams with comprehensive
						Scrum tools.
					</p>
				</div>

				<div>
					<h4 className="font-semibold mb-4">Quick Links</h4>
					<ul className="space-y-2">
						<li>
							<Link to="/" className="hover:text-primary transition-colors">
								Home
							</Link>
						</li>
						<li>
							<button
								onClick={handleHowItWorksClick}
								className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none text-left p-0 text-white">
								How It Works
							</button>
						</li>
					</ul>
				</div>

				{/* Legal Section */}
				<div>
					<h4 className="font-semibold mb-4">Legal</h4>
					<ul className="space-y-2">
						<li>
							<Link
								to="/terms"
								className="hover:text-primary transition-colors">
								Terms of Service
							</Link>
						</li>
						<li>
							<Link
								to="/privacy"
								className="hover:text-primary transition-colors">
								Privacy Policy
							</Link>
						</li>
					</ul>
				</div>

				{/* Contact Section */}
				<div>
					<h4 className="font-semibold mb-4">Contact Us</h4>
					<ul className="space-y-2">
						<li>support@scrumhub.com</li>
					</ul>
					<div className="flex space-x-4 mt-4">
						<Link
							to="//www.linkedin.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-white hover:text-primary transition-colors">
							<Linkedin className="w-6 h-6" />
						</Link>
						<Link
							to="//www.twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-white hover:text-primary transition-colors">
							<Twitter className="w-6 h-6" />
						</Link>
						<Link
							to="//www.instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-white hover:text-primary transition-colors">
							<Instagram className="w-6 h-6" />
						</Link>
					</div>
				</div>
			</div>

			<div className="border-t border-gray-700 mt-8 pt-6 text-center">
				<p className="text-sm text-gray-400">
					© {new Date().getFullYear()} ScrumHub. All Rights Reserved.
				</p>
			</div>
		</footer>
	);
}

export default Footer;
