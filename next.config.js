import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    MAILTRAP_API_TOKEN: process.env.MAILTRAP_API_TOKEN,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    minimumCacheTTL: 60,
  },
  reactStrictMode: true,
};

export default config;
