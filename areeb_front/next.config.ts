/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yanbo3-back.cowdly.com',
      },
    ],
  },
};

module.exports = nextConfig;
