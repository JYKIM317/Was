import { Router } from '../core/router/Router';
import { verifyController, tokenRefreshController } from '../controller/auth/authorizeController';


const authorizeRouter = new Router();

authorizeRouter.post("/authorization/verify", verifyController);
authorizeRouter.post("/authorization/refresh", tokenRefreshController);

export { authorizeRouter }