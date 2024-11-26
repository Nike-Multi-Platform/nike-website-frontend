/** @type {import('tailwindcss').Config} */
import { fontFamily as _fontFamily } from "tailwindcss/defaultTheme";
export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    fontFamily: {
      nike: [
        "'Nike Futura ND'",
        "'Helvetica Now Text Medium'",
        "Helvetica",
        "Arial",
        ..._fontFamily.sans,
      ],
      nikeBody: [
        "'Helvetica Now Text'",
        "Helvetica",
        "Arial",
        ..._fontFamily.sans,
      ],
    },
    fontSize: {
      display2: ["4.75rem", { lineHeight: ".9", fontWeight: "800" }],
      body1: ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
    },
  },
};
export const plugins = [];
export const important = true;
