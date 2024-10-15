import { fetchPOST } from "../scripts/fetch.js";
import { SmallButton } from "../components/Button.js";
import { InputBox, TextAreaBox } from "../components/InputBox.js";
import { Navigation, Information, HorizontalHugFrame } from "../components/Frame.js";
import { verifyAccessTokenValid } from "../scripts/authorization.js";
import { PostNavigation } from "../components/Post.js"

const url = "http://localhost:8080";
let writeLoadingState = false;

async function render() {
    const tokenValid = await verifyAccessTokenValid();
    if (!tokenValid) location.href = url + "/login.html";

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
        .createContextualFragment(Information("글쓰기", "post-title"));

    const writeTitleNode = document
        .createRange()
        .createContextualFragment(InputBox("write-title", "제목", "text", "글의 제목을 입력하세요"));

    const writeContentNode = document
        .createRange()
        .createContextualFragment(TextAreaBox("write-content", "내용", "text", "글의 내용을 입력하세요"));

    const boardNavigationNode = document
        .createRange()
        .createContextualFragment(PostNavigation("post-write-navigation", [SmallButton("작성 완료", "write-button")]));

    const fragment = document.createDocumentFragment();
    fragment.appendChild(navigationNode);
    fragment.appendChild(postTitleNode);
    fragment.appendChild(writeTitleNode);
    fragment.appendChild(writeContentNode);
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

    document.getElementById("write-button").addEventListener("click", async (_) => {
        const titleBox = document.getElementById("write-title");
        const contentBox = document.getElementById("write-content");
        const title = titleBox.querySelector("input").value.trim();
        const content = contentBox.querySelector("textarea").value.trim();
        const NON_TEXT = "";

        if (writeLoadingState) return;
        if (title == NON_TEXT || content == NON_TEXT) return;

        writeLoadingState = true;
        await verifyAccessTokenValid();
        fetchPOST(url + "/board/post", { title, content }).then((response) => {
            writeLoadingState = false;
            const isCreate = 201;
            if (response.status === isCreate) {
                location.href = url;
            }
        });
    });
}

render();