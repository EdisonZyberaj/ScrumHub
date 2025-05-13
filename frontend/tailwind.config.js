/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				// You can customize these colors for your ScrumHub project
				primary: "#7886C7", // Using your mediumBlue as primary
				secondary: "#A9B5DF", // Using your softBlue as secondary
				accent: "#5F6AB0", // Using your hoverBlue as accent
				dark: "#2D336B", // Using your darkBlue as dark
				light: "#C7D9DD" // Using your lightBlue as light
			}
		}
	},
	plugins: []
};
