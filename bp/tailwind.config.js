/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#2563eb',
        'primary-blue-dark': '#1d4ed8', // A darker shade for hover
        'app-background': '#f9fafb', // gray-50
        'card-background': '#ffffff',
        'heart-red': '#ef4444',
        'accent-purple': '#9333ea',
        'text-primary': '#374151', // gray-700
        'text-secondary': '#6b7280', // gray-500
        'text-muted': '#9ca3af', // gray-400
        'ui-border': '#e5e7eb', // gray-200
        // Health Status Colors
        'bp-normal': '#16a34a',
        'bp-elevated': '#ca8a04',
        'bp-stage1': '#ea580c',
        'bp-stage2': '#dc2626',
        'bp-crisis': '#991b1b',
      }
    },
  },
  plugins: [],
}
