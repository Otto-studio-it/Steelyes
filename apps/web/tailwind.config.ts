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
        steel: "rgb(var(--color-steel-rgb) / <alpha-value>)",
        muted: "rgb(var(--color-muted-rgb) / <alpha-value>)",
        "muted-deep": "rgb(var(--color-muted-deep-rgb) / <alpha-value>)",
        paper: "rgb(var(--color-paper-rgb) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--color-primary-rgb) / <alpha-value>)",
          dark: "rgb(var(--color-primary-dark-rgb) / <alpha-value>)",
          soft: "rgb(var(--color-primary-soft-rgb) / <alpha-value>)",
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
      },
      keyframes: {
        'hero-reveal': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'hero-line-draw': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        'hero-image-in': {
          from: { opacity: '0', transform: 'scale(1.05)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'hero-reveal': 'hero-reveal 450ms ease-out both',
        'hero-line-draw': 'hero-line-draw 600ms ease-out both',
        'hero-image-in': 'hero-image-in 900ms ease-out both',
      },
    },
  },
  plugins: [],
};
export default config;
