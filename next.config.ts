import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* TODO: Edit this later to pull from s3 bucket
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        port: "",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;
