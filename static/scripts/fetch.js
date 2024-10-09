async function fetchPOST(uri, data) {
    const accessToken = window.localStorage.getItem("accessToken");
    if (accessToken != null) data.accessToken = accessToken;

    await fetch(uri, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }).then((response) => {
        const contentType = response.headers.get("Content-Type");
        const isJSON = contentType === "application/json";
        return [response, isJSON ? response.json() : {}];
    }).then(([response, body]) => {
        if (body.accessToken != null) {
            window.localStorage.setItem("accessToken", body.accessToken);
        }
        if (body.refreshToken != null) {
            window.localStorage.setItem("refreshToken", body.refreshToken);
        }
        return response;
    });
}

export { fetchPOST }