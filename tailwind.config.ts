import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // add if you use /src
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: "var(--font-playfair)",
        blackletter: "var(--font-blackletter)",
        geistSans: "var(--font-geistSans)",
        geistMono: "var(--font-geistMono)",
      },
    },
  },
  plugins: [],
};

export default config;