/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/changelog-monitor',
  assetPrefix: '/changelog-monitor',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig