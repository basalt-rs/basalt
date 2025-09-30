import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true,
    },
    output: 'export',
    trailingSlash: true,
};

export default nextConfig;
