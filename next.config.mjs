import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @interfaces {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@refinedev/antd'],
  output: 'standalone',
}

export default withNextIntl(nextConfig)
