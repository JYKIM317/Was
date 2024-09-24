import { Router } from './Router';
import { staticController } from '../controller/staticController';


const staticRouter = new Router();

staticRouter.get("/", staticController);

export {staticRouter}
