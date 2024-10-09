import { fetchPOST } from "./fetch.js";

const url = "http://localhost:8080";

async function verifyAccessTokenValid() {
    const accessToken = window.localStorage.getItem("accessToken");
    if (accessToken == null) return false;

    return await fetchPOST(`${url}/authorization/verify`).then(async (response) => {
        const isOK = 200;
        const UNATHORIZED = 401;
        if (response.status === isOK) {
            return true;
        }
        else if (response.status === UNATHORIZED) {
            return await requestTokenRefresh();
        } else {
            return false;
        }
    });
}

async function requestTokenRefresh() {
    //`${url}/autorization/refresh`
    const refreshToken = window.localStorage.getItem("refreshToken");

}

export { verifyAccessTokenValid }