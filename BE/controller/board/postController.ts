import { PostRepository } from "../../repository/PostRepository"
import { logger } from "../../logger";

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

            if (isPostExist) res.setStatus(200).json(post);
            else res.setStatus(404).send();
        });
    } catch (e) {
        logger.error(e);
        res.setStatus(500).send();
    }
}


export { boardController, postController }