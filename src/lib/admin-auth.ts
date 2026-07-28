import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "fff_admin_session";

export function getAdminSecret(): string | null {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || null;
}

export function isAdminConfigured(): boolean {
  return Boolean(getAdminSecret());
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const secret = getAdminSecret();
  if (!secret) return false;
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  return token === secret;
}

export function isAdminRequest(req: NextRequest): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (cookie === secret) return true;

  const header = req.headers.get("x-admin-secret");
  if (header === secret) return true;

  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  return false;
}

export { COOKIE_NAME };
