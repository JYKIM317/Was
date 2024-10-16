import { boardController, postController, postPageContoller } from '../controller/board/postController';
import { postWriteController } from '../controller/board/postWriteController'
import { Router } from '../core/router/Router';

const boardRouter = new Router();

boardRouter.get("/board/post", boardController);
boardRouter.get("/board/post/:postId", postPageContoller);

boardRouter.post("/board/post", postWriteController);
boardRouter.post("/board/post/:postId", postController);

export { boardRouter }
