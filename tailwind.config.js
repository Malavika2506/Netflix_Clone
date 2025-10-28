export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'ping-slow': 'ping 0.8s ease-in-out',
      },
    },
  },
  plugins: [],
};
