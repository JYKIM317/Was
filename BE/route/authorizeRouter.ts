import { Router } from '../core/router/Router';
import { verifyController } from '../controller/authorizeController';


const authorizeRouter = new Router();

authorizeRouter.post("/authorization/verify", verifyController);

export { authorizeRouter }