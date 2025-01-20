/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {// Enable SVG support       // Skip optimization
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*',
            },
            {
                protocol: 'http',
                hostname: '*',
            },
        ],
    }
}

export default nextConfig