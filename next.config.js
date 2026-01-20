/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [process.env.MONGODB_URI, 'res.cloudinary.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

export default nextConfig; 