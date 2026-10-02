import { test } from "node:test";
import assert from "node:assert";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
} from "../lib/auth/admin-auth";

test("Password hashing and verification should work securely with bcrypt", async () => {
  const plain = "SecretAdminPass@2026!";
  const hash = await hashPassword(plain);

  assert.notStrictEqual(plain, hash);
  assert.strictEqual(await verifyPassword(plain, hash), true);
  assert.strictEqual(await verifyPassword("WrongPassword", hash), false);
});

test("Admin session token should generate valid signed token and detect tampering", async () => {
  const payload = {
    adminId: "admin_123",
    email: "admin@seu.edu.sa",
  };

  const token = await createSessionToken(payload, 2);
  const verified = await verifySessionToken(token);

  assert.notStrictEqual(verified, null);
  assert.strictEqual(verified?.adminId, "admin_123");
  assert.strictEqual(verified?.email, "admin@seu.edu.sa");

  // Tampered token test
  const tampered = token.slice(0, -3) + "xyz";
  assert.strictEqual(await verifySessionToken(tampered), null);
});
