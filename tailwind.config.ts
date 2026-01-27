import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./styles/**/*.css"],
  theme: {
    extend: {
      colors: {
        bg0: "#070a0f",
        bg1: "#0b1020",
        neonCyan: "#4fd1ff",
        neonPink: "#ff4fd8",
        neonPurple: "#8b5cf6",
        neonBlue: "#3b82f6",
        neonYellow: "#facc15",
      },
      boxShadow: {
        glow: "0 0 25px rgba(79, 209, 255, 0.2)",
        card: "0 20px 50px rgba(5, 6, 11, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
