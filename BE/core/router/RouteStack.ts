import { Router } from "./Router";

/*
TODO: 이후 개선 탐색할 때 시간 복잡도를 고려해서 Map, object같은 타입 혹은 트리형태를 고려하는 것이 좋을 듯
*/

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