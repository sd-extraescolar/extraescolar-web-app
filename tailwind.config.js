/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Extraescolar Brand Colors
        'education-green': {
          DEFAULT: '#2ECC71',
          50: '#E8F8F0',
          100: '#D1F2E1',
          200: '#A3E5C3',
          300: '#75D8A5',
          400: '#47CB87',
          500: '#2ECC71',
          600: '#27AE60',
          700: '#1F8B4C',
          800: '#176838',
          900: '#0F4524',
        },
        'digital-blue': {
          DEFAULT: '#3498DB',
          50: '#EBF5FD',
          100: '#D6EFFF',
          200: '#ADE0FF',
          300: '#85D0FF',
          400: '#5CC1FF',
          500: '#3498DB',
          600: '#2980B9',
          700: '#1F6897',
          800: '#155075',
          900: '#0A3853',
        },
        'progress-yellow': {
          DEFAULT: '#F1C40F',
          50: '#FEF9E7',
          100: '#FDF4CF',
          200: '#FBE99F',
          300: '#F9DE6F',
          400: '#F7D33F',
          500: '#F1C40F',
          600: '#D4A70C',
          700: '#A68209',
          800: '#785E06',
          900: '#4A3A04',
        },
        'alert-red': {
          DEFAULT: '#E74C3C',
          50: '#FDEDEB',
          100: '#FBDBD7',
          200: '#F7B7AF',
          300: '#F39387',
          400: '#EF6F5F',
          500: '#E74C3C',
          600: '#C0392B',
          700: '#922B20',
          800: '#641D16',
          900: '#360F0B',
        },
        'dark-text': '#2C3E50',
        'medium-gray': '#95A5A6',
        'light-gray': '#ECF0F1',
        
        // Shadcn/ui compatible colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "#2ECC71",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#3498DB",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#ECF0F1",
          foreground: "#2C3E50",
        },
        accent: {
          DEFAULT: "#F1C40F",
          foreground: "#2C3E50",
        },
        destructive: {
          DEFAULT: "#E74C3C",
          foreground: "#FFFFFF",
        },
        border: "#95A5A6",
        input: "#ECF0F1",
        ring: "#2ECC71",
        chart: {
          "1": "#2ECC71",
          "2": "#3498DB",
          "3": "#F1C40F",
          "4": "#E74C3C",
          "5": "#95A5A6",
        },
      },
    },
  },
  plugins: [],
}
