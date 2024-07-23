/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'adzipdznfliuflozgkeb.supabase.co'
            }
        ]
    }
};

export default nextConfig;
