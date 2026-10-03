import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  async rewrites() {
    const api = process.env.API_URL ?? "http://127.0.0.1:4000";
    return [{ source: "/api/:path*", destination: `${api}/api/:path*` }];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
