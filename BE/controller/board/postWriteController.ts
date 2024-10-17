import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
import { PostRepository } from "../../repository/PostRepository"
import { logger } from "../../logger";
import { decrypt } from "../../core/auth/crypto";
import { UserRepository } from "../../repository/UserRepository";
import { dateFormatParser } from "../../util/parser";
import Authorization from "../../core/auth/Authorization";

const filePath = fileURLToPath(import.meta.url);
const imageStoragePath = path.join(filePath, "../../../../", "imageStorage");

async function postWriteController(req, res) {
    try {
        const accesstoken = req.body.accessToken;
        const isVerified = Authorization.verifyToken(accesstoken, "Access");
        if (!isVerified) return res.setStatus(401).send();

        const [_, bodyOfToken] = accesstoken.split(".");
        const bodyJsonString = decrypt(bodyOfToken);
        const result = await UserRepository.getUser(JSON.parse(bodyJsonString).aud);
        const userData = result[0];
        const { title, content, image } = req.body;

        const postData = {
            title, content, image,
            member_email: userData.email,
            author: userData.name,
            createAt: dateFormatParser(new Date()),
            view: 0
        };

        if (image != null) {
            const userImagePath = path.join(imageStoragePath, userData.email);
            if (!fs.existsSync(imageStoragePath)) fs.mkdirSync(imageStoragePath);
            if (!fs.existsSync(userImagePath)) fs.mkdirSync(userImagePath);
            fs.writeFileSync(path.join(userImagePath, image), req.body.imageFile);
        }

        await PostRepository.createPost(postData);
        res.setStatus(201).send();
    } catch (e) {
        console.log(e);
        logger.error(e);
        res.setStatus(500).send();
    }
}

export { postWriteController }