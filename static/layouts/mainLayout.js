import { SmallButton } from "../components/Button.js";
import { Navigation, Information, HorizontalHugFrame } from "../components/Frame.js";
import { verifyAccessTokenValid } from "../scripts/authorization.js";

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
    addEvent();
}


function addEvent() {
    const url = "http://localhost:8080";

    //navigate to login page
    document.getElementById("user-navigator-button").addEventListener("click", (event) => {
        window.location.href = `${url}/login.html`;
    });

    //TODO: 로그인 상태 네비게이터 버튼 이벤트 등록
}

render();