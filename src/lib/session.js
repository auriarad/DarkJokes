import { sealData, unsealData } from 'iron-session';

const sessionSecret = process.env.SESSION_SECRET;
const sessionTTL = 86400 * 30;
export async function createAdminSession(adminId) {
    return await sealData(
        { adminId, createdAt: Date.now() },
        { password: sessionSecret, ttl: sessionTTL }
    );
}

export async function getAdminSession(cookie) {
    if (!cookie) return null;
    return await unsealData(cookie, { password: sessionSecret });
}
