import { fetchPOST } from "../scripts/fetch.js";
import { SmallButton } from "../components/Button.js";
import { Navigation, Information, HorizontalHugFrame } from "../components/Frame.js";
import { verifyAccessTokenValid } from "../scripts/authorization.js";
import { PostInfo, PostContent, PostNavigation, ImageContent } from "../components/Post.js"

const url = "http://localhost:8080";

async function render() {
    const tokenValid = await verifyAccessTokenValid();
    if (!tokenValid) return location.href = url + "/login.html";

    const postData = await fetchPOST(location.href).then((response) => response.json());

    const navigationNode = document
        .createRange()
        .createContextualFragment(Navigation("HELLO, WEB!", [
            HorizontalHugFrame("user-naviator-button-list", [
                SmallButton("멤버리스트", "user-memberlist-button"),
                SmallButton("마이페이지", "user-mypage-button"),
                SmallButton("로그아웃", "user-logout-button")
            ])]
        ));


    const postTitleNode = document
        .createRange()
        .createContextualFragment(Information(postData.title, "post-title"));

    const postInfoNode = document
        .createRange()
        .createContextualFragment(PostInfo(postData.author, dateFormatParser(postData.createAt), postData.view));

    const postContentNode = document
        .createRange()
        .createContextualFragment(PostContent([
            postData.image != null ? ImageContent(postData.image, postData.imageType) : "",
            postData.content,
        ]));

    const boardNavigationNode = document
        .createRange()
        .createContextualFragment(PostNavigation("post-navigation", [
            HorizontalHugFrame("post-page-navigation", [
                SmallButton("이전 글", "before-button"),
                SmallButton("다음 글", "next-button")
            ]),
            SmallButton("목록으로", "main-navigator-button")
        ]));

    const fragment = document.createDocumentFragment();
    fragment.appendChild(navigationNode);
    fragment.appendChild(postTitleNode);
    fragment.appendChild(postInfoNode);
    fragment.appendChild(postContentNode);
    fragment.appendChild(boardNavigationNode);

    document.body.querySelector("#root").appendChild(fragment);
    addEvent();
}

function addEvent() {
    document.getElementById("user-logout-button").addEventListener("click", (_) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        location.href = url;
    });

    document.getElementById("main-navigator-button").addEventListener("click", (_) => {
        location.href = url;
    });
}

function dateFormatParser(date) {
    const thisDate = new Date(date);
    return [
        thisDate.getFullYear(),
        `${thisDate.getMonth()}`.padStart(2, "0"),
        `${thisDate.getDay()}`.padStart(2, "0")
    ].join("-");
}

render();