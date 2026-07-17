/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
        pathname: "/**", // Mengizinkan semua path dari domain ini
      },
    ],
  },
  // Tambahkan baris ini agar Next.js tidak mengganggu worker pdf-parse
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
