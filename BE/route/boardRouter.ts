import { boardController, postController } from '../controller/board/postController';
import { commentController } from '../controller/board/commentController';
import { Router } from '../core/router/Router';

const boardRouter = new Router();

boardRouter.get("/board/post", boardController);
boardRouter.post("/board/post/:postId", postController);
boardRouter.post("/board/comment/:postId", commentController);

export { boardRouter }
