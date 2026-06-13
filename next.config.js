/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tgfpfwjxtrmrplolfauj.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
