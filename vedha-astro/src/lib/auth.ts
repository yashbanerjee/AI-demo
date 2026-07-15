import crypto from "node:crypto";

const secret =
  import.meta.env.SESSION_SECRET ?? process.env.SESSION_SECRET ?? "insecure-dev-secret";

export const SESSION_COOKIE = "vedha_admin";

function sign(value: string): string {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function createToken(days = 7): string {
  const expires = Date.now() + days * 24 * 60 * 60 * 1000;
  return `${expires}.${sign(String(expires))}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  const expected = sign(expires);
  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return false;
  }
  return Number(expires) > Date.now();
}

export function checkPassword(password: string): boolean {
  const expected = import.meta.env.ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD;
  return Boolean(expected) && password === expected;
}
