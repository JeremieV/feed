import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  dest: 'public',
  // reactStrictMode: true
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development mode
})({
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
});

export default nextConfig;
