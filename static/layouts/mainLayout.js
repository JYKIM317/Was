import { SmallButton } from "../components/Button.js";
import { Navigation, Information, HorizontalHugFrame } from "../components/Frame.js";
import { verifyAccessTokenValid } from "../scripts/authorization.js";
import { getBoardPage } from "../scripts/board.js";
import { Board, PostTable, PostElement } from "../components/Board.js"
import { fetchPOST } from "../scripts/fetch.js";

async function render() {
    const tokenValid = await verifyAccessTokenValid();

    const navigationNode = document
        .createRange()
        .createContextualFragment(Navigation("HELLO, WEB!",
            tokenValid
                ? [HorizontalHugFrame("user-naviator-button-list", [
                    SmallButton("멤버리스트", "user-memberlist-button"),
                    SmallButton("마이페이지", "user-mypage-button"),
                    SmallButton("로그아웃", "user-logout-button")
                ])]
                : [SmallButton("로그인/회원가입", "user-navigator-button")]
        ));
    const informationNode = document.createRange().createContextualFragment(Information("부스트캠프 백엔드 교육용 페이지", "main-information", ["<h2>HELLO, WEB! 입니다.</h2>"]));

    const fragment = document.createDocumentFragment();
    fragment.appendChild(navigationNode);
    fragment.appendChild(informationNode);

    document.body.querySelector("#root").appendChild(fragment);

    //게시판 보드
    await getBoardPage(1).then((data) => {
        const tableHead = { title: "제목", author: "작성자", createAt: "작성일자", view: "조회수" };
        const postList = data.result.map((element) => {
            element.createAt = dateFormatParser(element.createAt);
            return PostElement(element, element.id);
        });
        const postTable = PostTable([PostElement(tableHead, "table-head"), ...postList]);
        const board = Board([postTable]);
        const boardNode = document
            .createRange()
            .createContextualFragment(board);

        document.body.querySelector("#root").appendChild(boardNode);
    });

    addEvent(tokenValid);
}


function addEvent(isLogin) {
    const url = "http://localhost:8080";

    if (isLogin) {
        //logout
        document.getElementById("user-logout-button").addEventListener("click", (_) => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            location.reload();
        });
    } else {
        //navigate to login page
        document.getElementById("user-navigator-button").addEventListener("click", (_) => {
            location.href = `${url}/login.html`;
        });
    }

    document.getElementById("board").addEventListener("click", async (event) => {
        const targetElement = event.target.closest(".post-element");
        if (targetElement.id !== "table-head") {
            await fetchPOST(url + `/board/post/${targetElement.id}`).then((response) => {
                const isOK = 200;
                if (response.status === isOK) return response.json();
                else return {};
            }).then((json) => {
                if (json.redirect != null) location.href = json.redirect;
            });
        }
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