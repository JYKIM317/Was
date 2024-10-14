import { Router } from "../core/router/Router";
import { signUpController } from "../controller/sign/signUpController";
import { signInController } from "../controller/sign/signInController";
import { userListController } from "../controller/user/userlistController";

const userRouter = new Router();

userRouter.post("/user/register", signUpController);
userRouter.post("/user/login", signInController);

userRouter.get("/user/list", userListController);
userRouter.post("/user/list", userListController);

export { userRouter };
