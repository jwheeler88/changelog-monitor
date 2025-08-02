/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'claude': ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        'claude-mono': ['"JetBrains Mono"', 'monospace'],
        'claude-ui': ['"Segoe UI"', 'sans-serif']
      },
      colors: {
        'claude': {
          'cream': '#eeece2',
          'warm-cream': '#f4c28e',
          'orange': '#da7756',
          'button': '#bd5d3a',
          'text': '#3d3929',
          'card': '#374151',
          'card-hover': '#4b5563'
        }
      },
      backgroundImage: {
        'claude-gradient': 'linear-gradient(135deg, #eeece2 0%, #f4c28e 100%)',
      }
    },
  },
  plugins: [],
}