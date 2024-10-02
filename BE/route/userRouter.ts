import { Router } from "../core/router/Router";
import { signUpController } from "../controller/signUpController";
import { signInController } from "../controller/signInContorller";

const userRouter = new Router();

userRouter.post("/user/register", signUpController);
userRouter.post("/user/login", signInController);

export { userRouter };
