import { Router } from '../core/router/Router';
import { staticController } from '../controller/staticController';


const staticRouter = new Router();

staticRouter.get("/", staticController);
staticRouter.get("/:filename", staticController);
staticRouter.get("/assets/:filename", staticController);

export { staticRouter }
