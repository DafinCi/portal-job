/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tambahkan baris ini agar Next.js tidak mengganggu worker pdf-parse
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
