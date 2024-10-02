import { Router } from "./Router";

class RouteStack {
    routes: Array<{ [key: string]: Router }> = [];

    use(route, router) {
        this.routes.push({ [route]: router });
        this.routes.sort((a, b) => {
            const aKey = Object.keys(a)[0];
            const bKey = Object.keys(b)[0];

            return bKey.length - aKey.length
        });
    }

    find(path) {
        for (let i = 0; i < this.routes.length; i++) {
            const routePath = Object.keys(this.routes[i])[0];
            if (path.startsWith(routePath))
                return this.routes[i][routePath];
        }
        return null;
    }
}

const routeStack = new RouteStack();

export { routeStack }