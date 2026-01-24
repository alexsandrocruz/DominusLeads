/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#135bec",
                "background-light": "#f6f6f8",
                "background-dark": "#101622",
                "card-dark": "#192233",
                "accent-green": "#10b981",
            },
            fontFamily: {
                "sans": ["Inter", "sans-serif"],
                "display": ["Inter", "sans-serif"],
                "grotesk": ["Space Grotesk", "sans-serif"],
                "mono": ["JetBrains Mono", "monospace"]
            },
            borderRadius: {
                "xl": "0.75rem",
                "2xl": "1rem",
            }
        },
    },
    plugins: [],
}
