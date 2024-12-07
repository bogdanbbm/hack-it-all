/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",  // Adjust as needed for file extensions in your src folder
  ],
  theme: {
   
    extend: {
      width: {
        '600': '600px',
       }
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light"], // You can try "dark" or other DaisyUI themes
  },
};
