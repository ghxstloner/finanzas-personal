import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "typewriter": "typewriter 2s steps(11) forwards",
        "caret": "typewriter 2s steps(11) forwards, blink 1s steps(1) infinite 2s",
      },
      keyframes: {
        typewriter: {
          to: {
            left: "100%",
          },
        },
        blink: {
          "0%": {
            opacity: "0",
          },
          "0.1%": {
            opacity: "1",
          },
          "50%": {
            opacity: "1",
          },
          "50.1%": {
            opacity: "0",
          },
          "100%": {
            opacity: "0",
          },
        },
      },
      backgroundImage: {
        "dot-thick-neutral-300": "radial-gradient(circle, #d4d4d4 1px, transparent 1px)",
        "dot-thick-neutral-800": "radial-gradient(circle, #404040 1px, transparent 1px)",
        "dot-thick-indigo-500": "radial-gradient(circle, #6366f1 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-pattern": "20px 20px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  darkMode: "class",
} satisfies Config;

export default config;