/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Isso ajuda em desenvolvimento local
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*', // Proxy para o backend na porta 3000
      },
    ];
  },
}

module.exports = nextConfig 