import crypto from "crypto"
import bcrypt from "bcrypt"
//파일명 encryption 같은 네이밍은 어떨지 고민해볼 것 auth crypto랑 겹치는게 좀 그럼

//For password encryption
function passwordEncryption(data) {
    return bcrypt.hashSync(data, 1);
}

//For sid generate
function sha1Encryption(data) {
    return crypto.createHash("sha1").update(data + process.env.SECRET).digest("hex");
}

export { passwordEncryption, sha1Encryption }