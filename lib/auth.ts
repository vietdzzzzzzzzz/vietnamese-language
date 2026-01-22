import crypto from "crypto"

const PBKDF2_ITERATIONS = 120000
const PBKDF2_KEYLEN = 32
const PBKDF2_DIGEST = "sha256"

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST)
    .toString("hex")
  return `pbkdf2$${PBKDF2_ITERATIONS}$${salt}$${hash}`
}

export function verifyPassword(password: string, stored: string) {
  if (!stored || !stored.includes("$")) {
    return password === stored
  }

  const [algo, iterRaw, salt, hash] = stored.split("$")
  if (algo !== "pbkdf2") return false

  const iterations = Number(iterRaw)
  if (!iterations || !salt || !hash) return false

  const derived = crypto
    .pbkdf2Sync(password, salt, iterations, PBKDF2_KEYLEN, PBKDF2_DIGEST)
    .toString("hex")

  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(derived, "hex"))
}
