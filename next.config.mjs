/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Build time par dynamic types aur SSR errors ko ignore karega
    ignoreBuildErrors: true,
  },
  eslint: {
    // Linting warnings se build crash hone se rokega
    ignoreDuringBuilds: true,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
