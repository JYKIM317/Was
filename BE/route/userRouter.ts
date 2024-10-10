import { Router } from "../core/router/Router";
import { signUpController } from "../controller/signUpController";
import { signInController } from "../controller/signInController";
import { userListController } from "../controller/userlistController";

const userRouter = new Router();

userRouter.post("/user/register", signUpController);
userRouter.post("/user/login", signInController);

userRouter.get("/user/list", userListController);
userRouter.post("/user/list", userListController);

export { userRouter };
