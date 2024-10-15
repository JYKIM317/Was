import { Router } from "../core/router/Router";
import { signUpController } from "../controller/sign/signUpController";
import { signInController } from "../controller/sign/signInController";

const userRouter = new Router();

userRouter.post("/user/register", signUpController);
userRouter.post("/user/login", signInController);

export { userRouter };
