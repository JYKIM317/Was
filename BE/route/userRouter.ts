import { Router } from "./Router";
import { userController } from "../controller/userController";

const userRouter = new Router();

userRouter.get("/user/register", userController);

export { userRouter };
