export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgMain: '#07181E',
        bgDarker: '#051318',
        bgCard: '#0D2229',
        borderCard: '#1D363E',
        borderCardHover: '#29444C',
        brand: {
          DEFAULT: '#4DE2BD',
          hover: '#41D1AC',
          light: '#65ECCB',
          dark: '#143C3A',
        },
        muted: '#A9C0C7',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-brand': '0 0 25px -4px rgba(77, 226, 189, 0.45)',
        'glow-card': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
