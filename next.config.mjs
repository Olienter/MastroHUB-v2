/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Removed remotePatterns for Unsplash to prevent 404 errors
  // All images now use local placeholder paths
};

export default nextConfig;
