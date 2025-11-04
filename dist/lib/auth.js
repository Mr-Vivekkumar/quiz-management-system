import crypto from "crypto";
// Simple password hashing (in production, use bcrypt)
export function hashPassword(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
}
export function verifyPassword(password, hash) {
    return hashPassword(password) === hash;
}
export function generateToken() {
    return crypto.randomBytes(32).toString("hex");
}
