import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { createHmac, timingSafeEqual } from "crypto";
import { getSql, isDatabaseConfigured } from "@/lib/db";
import type { AdminRole, AdminUser, Permission } from "./types";
import { hasPermission } from "./types";

const COOKIE = "fff_crm_session";
const LEGACY_COOKIE = "fff_admin_session";

export type SessionActor = {
  id: string | null;
  email: string;
  name: string;
  role: AdminRole;
  isLegacy: boolean;
};

function sessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_SECRET ||
    "dev-insecure-session-secret"
  );
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function createSessionToken(actor: {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}): string {
  const body = Buffer.from(
    JSON.stringify({
      ...actor,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    }),
  ).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function parseSessionToken(token: string | undefined | null): SessionActor | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      id: string;
      email: string;
      name: string;
      role: AdminRole;
      exp: number;
    };
    if (!data.exp || data.exp < Date.now()) return null;
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role || "Super Admin",
      isLegacy: false,
    };
  } catch {
    return null;
  }
}

export function getAdminSecret(): string | null {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || null;
}

export function isAdminConfigured(): boolean {
  return Boolean(getAdminSecret()) || isDatabaseConfigured();
}

export async function getSessionActor(): Promise<SessionActor | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  const parsed = parseSessionToken(token);
  if (parsed) return parsed;

  // Legacy single-secret session
  const legacy = jar.get(LEGACY_COOKIE)?.value;
  const secret = getAdminSecret();
  if (secret && legacy === secret) {
    return {
      id: null,
      email: "admin@local",
      name: "Super Admin",
      role: "Super Admin",
      isLegacy: true,
    };
  }
  return null;
}

export function getSessionActorFromRequest(req: NextRequest): SessionActor | null {
  const token = req.cookies.get(COOKIE)?.value;
  const parsed = parseSessionToken(token);
  if (parsed) return parsed;

  const secret = getAdminSecret();
  const legacy = req.cookies.get(LEGACY_COOKIE)?.value;
  if (secret && legacy === secret) {
    return {
      id: null,
      email: "admin@local",
      name: "Super Admin",
      role: "Super Admin",
      isLegacy: true,
    };
  }
  if (secret && req.headers.get("x-admin-secret") === secret) {
    return {
      id: null,
      email: "admin@local",
      name: "Super Admin",
      role: "Super Admin",
      isLegacy: true,
    };
  }
  return null;
}

export async function requireActor(
  perm?: Permission,
): Promise<SessionActor> {
  const actor = await getSessionActor();
  if (!actor) throw new Error("UNAUTHORIZED");
  if (perm && !hasPermission(actor.role, perm)) throw new Error("FORBIDDEN");
  return actor;
}

export function requireActorFromRequest(
  req: NextRequest,
  perm?: Permission,
): SessionActor {
  const actor = getSessionActorFromRequest(req);
  if (!actor) throw new Error("UNAUTHORIZED");
  if (perm && !hasPermission(actor.role, perm)) throw new Error("FORBIDDEN");
  return actor;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function findUserByEmail(
  email: string,
): Promise<(AdminUser & { password_hash: string }) | null> {
  if (!isDatabaseConfigured()) return null;
  const db = getSql();
  const rows = await db`
    SELECT id, email, name, role, active, created_at, password_hash
    FROM admin_users
    WHERE lower(email) = ${email.toLowerCase()}
    LIMIT 1
  `;
  return (rows[0] as AdminUser & { password_hash: string }) || null;
}

export async function listUsers(): Promise<AdminUser[]> {
  if (!isDatabaseConfigured()) return [];
  const db = getSql();
  return (await db`
    SELECT id, email, name, role, active, created_at
    FROM admin_users
    ORDER BY created_at ASC
  `) as AdminUser[];
}

export async function ensureBootstrapSuperAdmin(): Promise<void> {
  if (!isDatabaseConfigured()) return;
  const secret = getAdminSecret();
  if (!secret) return;
  const db = getSql();
  const existing = await db`SELECT id FROM admin_users LIMIT 1`;
  if (existing.length) return;
  const hash = await hashPassword(secret);
  await db`
    INSERT INTO admin_users (email, name, password_hash, role, active)
    VALUES (
      ${"superadmin@fundforfounders.local"},
      ${"Super Admin"},
      ${hash},
      ${"Super Admin"},
      ${true}
    )
  `;
}

export { COOKIE as CRM_SESSION_COOKIE, LEGACY_COOKIE };
