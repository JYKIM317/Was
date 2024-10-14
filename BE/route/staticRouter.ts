import { Router } from '../core/router/Router';
import { staticController } from '../controller/static/staticController';

const staticRouter = new Router();

staticRouter.get("/", staticController);
staticRouter.get("/:filename", staticController);
staticRouter.get("/layouts/:filename", staticController);
staticRouter.get("/stylesheets/:filename", staticController);
staticRouter.get("/components/:filename", staticController);
staticRouter.get("/scripts/:filename", staticController);

export { staticRouter }
