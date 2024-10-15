/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production"
      ? {
          "@fullhuman/postcss-purgecss": {
            content: ["./pages/**/*.js", "./components/**/*.js"], // Specify your content files
            safelist: ["whitelist-this-class"], // Optional: Classes to keep even if not found
            defaultExtractor: (content) =>
              content.match(/[\w-/:]+(?<!:)/g) || [], // Extractor for CSS classes
          },
        }
      : {}),
  },
};

export default config;
