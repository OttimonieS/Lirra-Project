/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#3b82f6',
                    light: '#dbeafe',
                    hover: '#2563eb',
                },
                secondary: '#8b5cf6',
                'dark-gray': '#6b7280',
                'light-gray': '#f3f4f6',
                gray: '#d1d5db',
            },
        },
    },
    plugins: [],
}
