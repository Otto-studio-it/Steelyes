import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        ink: "var(--color-ink)",
        primary: {
          DEFAULT: "var(--color-primary)",
          container: "var(--color-primary-container)",
        },
        foundry: {
          gold: "var(--color-foundry-gold)",
        }
      },
      fontFamily: {
        heading: ["var(--font-barlow-condensed)"],
        body: ["var(--font-barlow)"],
        mono: ["var(--font-ibm-plex-mono)"],
      }
    },
  },
  plugins: [],
};
export default config;
