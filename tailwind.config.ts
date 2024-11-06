import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "blue-primary": "#0b164a",
        "blue-secondary": "#498bc2",
        "blue-tertiary": "#312f86",
        "yellow-primary": "#f2a842",
        "yellow-secondary": "#fad187",
        red: "#9c1b26",
        "pink-primary": "#dd7181",
        "pink-secondary": "#f7dee2",
        white: "#ffffff",
      },
    },
  },
  plugins: [],
};
export default config;
