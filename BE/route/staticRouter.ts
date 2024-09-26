import { Router } from './Router';
import { staticController } from '../controller/staticController';


const staticRouter = new Router();

staticRouter.get("/", staticController);
staticRouter.get("/assets/:filename", staticController);

export {staticRouter}
