import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          900: "#05060b",
          850: "#0b0f1b",
          800: "#12152a",
          700: "#1b1f3a",
        },
        neon: {
          cyan: "#4fd1ff",
          pink: "#ff4fd8",
          purple: "#8b5cf6",
          blue: "#3b82f6",
        },
      },
      boxShadow: {
        glow: "0 0 25px rgba(79, 209, 255, 0.2)",
        card: "0 20px 50px rgba(5, 6, 11, 0.35)",
      },
      backgroundImage: {
        "neon-border": "linear-gradient(120deg, rgba(79, 209, 255, 0.8), rgba(255, 79, 216, 0.8))",
        "hero-gradient": "radial-gradient(circle at top left, rgba(139, 92, 246, 0.28), transparent 50%), radial-gradient(circle at top right, rgba(79, 209, 255, 0.2), transparent 45%)",
      },
    },
  },
  plugins: [],
};

export default config;
