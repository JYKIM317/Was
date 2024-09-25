import net from 'net';
import { logger } from './logger';
import { Request } from './dto/Request';
import { staticRouter } from './route/staticRouter';

const server = net.createServer(socket => {
    socket.on("data", (data) => {
        const socketData = data.toString();
        const request =  new Request(socketData);
        console.log(request);
        const response = staticRouter.requestHandler(request);
       
        socket.write(response.responseMsg);
        if(request.headers.Connection == null) socket.end();
    });
});

server.listen(3000, () => {
    console.log("HTTP server running on port 3000");
});