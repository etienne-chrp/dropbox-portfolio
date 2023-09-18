/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: process.env.IMAGE_OPTIMIZATION.toLowerCase() === "false" ?? false,
  },
};

module.exports = nextConfig;
