/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable font optimization during CI build to avoid network-related crashes
  optimizeFonts: process.env.CI !== 'true',
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
