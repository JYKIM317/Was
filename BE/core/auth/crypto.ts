import crypto from "crypto";

const alg = 'aes-256-cbc';
const encryptedKey = crypto.randomBytes(32);
const initializeVector = crypto.randomBytes(16);

function encrypt(text) {
    const cipher = crypto.createCipheriv(alg, encryptedKey, initializeVector);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(alg, encryptedKey, initializeVector);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function createIntegrityTag(secret, body) {
    return crypto.createHash("sha256").update(body + secret).digest("hex");
}

export { encrypt, decrypt, createIntegrityTag }