import { PostRepository } from "../../repository/PostRepository"
import { logger } from "../../logger";

async function boardController(req, res) {
    try {
        const page = req.query.p;
        PostRepository.getBoard(page).then((response) => {
            const result = response[0];
            res.setStatus(200).json({ result });
        });
    } catch (e) {
        logger.error(e);
        res.setStatus(500).send();
    }
}

async function postController(req, res) {
    console.log(req);
}


export { boardController, postController }