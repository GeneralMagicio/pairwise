// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env/server.mjs'))

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'giveth.io',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'giveth.mypinata.cloud',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'user-images.githubusercontent.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'd2jyzh4ah9xf6q.cloudfront.net',
        pathname: '/**'
      }
    ]
  }
}
export default config
