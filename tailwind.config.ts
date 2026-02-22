import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            boxShadow: {
                'soft': '0 2px 15px rgba(0, 0, 0, 0.04)',
                'card': '0 4px 25px rgba(0, 0, 0, 0.06)',
                'elevated': '0 12px 40px rgba(0, 0, 0, 0.08)',
                'luxury': '0 20px 60px rgba(0, 0, 0, 0.10)',
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
