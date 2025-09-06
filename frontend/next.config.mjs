/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configure for production deployment
  trailingSlash: false,
  poweredByHeader: false,
  // Ensure static assets work correctly
  assetPrefix: undefined,
}

export default nextConfig
