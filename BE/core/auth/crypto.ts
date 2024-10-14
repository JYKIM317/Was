import crypto from "crypto";

const ALG = 'aes-256-cbc';
const ENCRYPTED_KEY = crypto.randomBytes(32);
const INITIALIZE_VECTOR = crypto.randomBytes(16);

function encrypt(text) {
    const cipher = crypto.createCipheriv(ALG, ENCRYPTED_KEY, INITIALIZE_VECTOR);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(ALG, ENCRYPTED_KEY, INITIALIZE_VECTOR);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function createIntegrityTag(secret, body) {
    return crypto.createHash("sha256").update(body + secret).digest("hex");
}

export { encrypt, decrypt, createIntegrityTag }