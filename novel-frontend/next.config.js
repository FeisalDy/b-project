/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'selfmtl.blob.core.windows.net'
      },
      {
        protocol: 'https',
        hostname: 'demofree.sirv.com'
      }
    ]
  }
}

module.exports = nextConfig
