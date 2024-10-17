import { PostRepository } from "../../repository/PostRepository"
import { logger } from "../../logger";
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

const filePath = fileURLToPath(import.meta.url);
const staticFilePath = path.join(filePath, "../../../../", "static");
const imageStoragePath = path.join(filePath, "../../../../", "imageStorage");

async function boardController(req, res) {
    try {
        const page = req.query.p;
        PostRepository.getBoard(page).then((response) => {
            const result = response;
            res.setStatus(200).json({ result });
        });
    } catch (e) {
        logger.error(e);
        res.setStatus(500).send();
    }
}

async function postController(req, res) {
    try {
        const postId = req.params.postId;
        PostRepository.getPost(postId).then((response) => {
            const post = response[0];
            const isPostExist = post != null;
            if (!isPostExist) return res.setStatus(404).send();

            if (post.image != null) {
                const thisPostImagePath = path.join(imageStoragePath, post["member_email"], post.image);
                fs.existsSync(thisPostImagePath)
                    ? post.image = fs.readFileSync(thisPostImagePath).toString("base64")
                    : post.image = null;
            }

            PostRepository.updatePostViewCount(postId);
            res.setStatus(200).json(post);
        });
    } catch (e) {
        logger.error(e);
        res.setStatus(500).send();
    }
}

function postPageContoller(req, res) {
    const postPageFilePath = path.join(staticFilePath, "post.html");
    try {
        res.setStatus(200).sendFile(postPageFilePath);
    } catch (e) {
        res.setStatus(404).send();
    }
}


export { boardController, postController, postPageContoller }