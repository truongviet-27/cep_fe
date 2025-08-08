import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @interfaces {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@refinedev/antd'],
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
        pathname: '/**',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
