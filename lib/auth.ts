import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');
const JWT_ISSUER = 'expertmedia';

export type SessionPayload = { userId: string; role: 'ADMIN' | 'STAFF' | 'MANAGER' | 'USER'; email: string };

export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function createSessionCookie(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
  return token;
}

export async function verifySessionCookie(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET, { issuer: JWT_ISSUER });
  return payload as unknown as SessionPayload;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}


