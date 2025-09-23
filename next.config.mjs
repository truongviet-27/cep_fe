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
    ],
  },
}

export default withNextIntl(nextConfig)
