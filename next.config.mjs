/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'invkzztpptkojocdjyst.supabase.co',
      },
    ],
  },
};

export default nextConfig;
