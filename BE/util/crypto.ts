import crypto from "crypto"

function md5Encryption(data) {
    return crypto.createHash("md5").update(data + process.env.SECRET).digest("hex");
}

export { md5Encryption }