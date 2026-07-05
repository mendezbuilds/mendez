import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'opfzwdxqbnkqevmmdlrq.supabase.co',
      },
    ],
  },
};

export default nextConfig;
