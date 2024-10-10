/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: [/mobile/], // Exclude the /mobile folder
    });

    return config;
  },
  async headers() {
    return [
      {
        // Match all images inside /data/*/images/ directories
        source: "/data/:folder*/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=1000, must-revalidate", // Cache images for 1000 seconds
          },
        ],
      },
    ];
  },
};

export default nextConfig;
