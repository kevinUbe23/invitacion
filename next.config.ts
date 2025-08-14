import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.1.50', '*.local-origin.dev'],
  output: 'standalone',
};

export default nextConfig;
