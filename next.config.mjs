/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },
    trailingSlash: true,
    distDir: 'out',
    webpack: (config) => {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        punycode: false,
      };
      return config;
    },
    experimental: {
      // Enable if needed for app router
      appDir: true,
    },
    // Ensure TypeScript paths work
    typescript: {
      tsconfigPath: './tsconfig.json',
    }
  };
  
  export default nextConfig;