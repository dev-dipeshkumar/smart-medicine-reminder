// Auth utilities for V23 Vite+ICP app
// Password-based auth uses PBKDF2+Ed25519 identity derivation
// All auth state is managed via AuthContext.tsx

export function hashPassword(username: string, password: string): string {
  return btoa(`${username}:${password}`);
}

export async function deriveIdentitySeed(
  username: string,
  password: string,
): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(`mediremind:${username.toLowerCase()}`),
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
  return new Uint8Array(bits);
}
