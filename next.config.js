/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: process.env.IMAGE_OPTIMIZATION.toLowerCase() === "false" ?? false,
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ]
  },
};

module.exports = nextConfig;
