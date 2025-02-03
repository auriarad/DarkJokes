import dotenv from 'dotenv';
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        const securityHeaders = [
            { key: 'X-XSS-Protection', value: '1; mode=block' },
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            {
                key: 'Content-Security-Policy',
                value: `
          default-src 'self';
          script-src 'self' 'unsafe-inline' *.trusted-cdn.com;
          style-src 'self' 'unsafe-inline';
          img-src 'self' data: *.trusted-cdn.com;
          font-src 'self';
          connect-src 'self' api.example.com;
          frame-src 'none';
          object-src 'none';
        `.replace(/\s+/g, ' ')
            }
        ];

        return [{
            source: '/(.*)',
            headers: securityHeaders,
        }];
    },
};

export default nextConfig;
