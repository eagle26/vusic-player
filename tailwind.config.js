module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        slide: 'slide 50s linear infinite',
      },
      willChange: {
        'bg-position': 'background-position',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
