import { Router } from "../core/router/Router";
import { userController } from "../controller/userController";

const userRouter = new Router();

userRouter.post("/user/register", userController);

export { userRouter };
