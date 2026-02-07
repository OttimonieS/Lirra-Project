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
                    DEFAULT: '#2E6EFF',
                    hover: '#1E5FEF',
                    light: '#EBF2FF',
                },
                secondary: '#7C3AED',
                gray: {
                    DEFAULT: '#D1D5DB',
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
                'dark-gray': '#6B7280',
                'light-gray': '#F9FAFB',
            },
        },
    },
    plugins: [],
}
