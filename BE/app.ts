import net from 'net';
import { logger } from './logger';
import { Request } from './dto/Request';
import { routeStack } from './route/RouteStack';
import { staticRouter } from './route/staticRouter';
import { userRouter } from './route/userRouter';
import { notFoundResponse } from './util/response';

routeStack.use("/", staticRouter);
routeStack.use("/user", userRouter);

const server = net.createServer(socket => {
    socket.on("data", (data) => {
        const socketData = data.toString();
        const request =  new Request(socketData);
        const router = routeStack.find(request.path);

        if(router) {
            const response = router.requestHandler(request);
            socket.write(response.responseMsg);
        } else {
            socket.write(notFoundResponse(request).responseMsg);
        }

        if(request.headers.Connection == null) socket.end();
    });
});

server.listen(3000, () => {
    console.log("HTTP server running on port 3000");
});