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
        hostname: 'dev-cep-erp-private.s3.ap-northeast-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'prod-cep-erp-private.s3.ap-northeast-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      canvas: false,
      fs: false,
      path: false,
    }
    return config
  },
}

export default withNextIntl(nextConfig)
