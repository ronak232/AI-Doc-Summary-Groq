export default {
  plugins: {
    tailwindcss: {
      content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
      theme: {
        extend: {},
      },
    },
    autoprefixer: {},
  },
};
