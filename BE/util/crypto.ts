import crypto from "crypto"
//TODO: bcrypt 쓰는게 좋을 겁니다. md5는 뚫렸음ㅎㅎ

//For password encryption
function md5Encryption(data) {
    return crypto.createHash("md5").update(data + process.env.SECRET).digest("hex");
}

//For sid generate
function sha1Encryption(data) {
    return crypto.createHash("sha1").update(data + process.env.SECRET).digest("hex");
}

export { md5Encryption, sha1Encryption }