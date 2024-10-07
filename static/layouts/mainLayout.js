import { SmallButton } from "../components/Button.js";
import { Navigation, Information } from "../components/Frame.js";

function render() {
    const navigationNode = document
        .createRange()
        .createContextualFragment(Navigation("HELLO, WEB!", [SmallButton("로그인/회원가입", "user-navigator-button")]));
    const informationNode = document.createRange().createContextualFragment(Information("부스트캠프 백엔드 교육용 페이지", "main-information", ["<h2>HELLO, WEB! 입니다.</h2>"]));

    const fragment = document.createDocumentFragment();
    fragment.appendChild(navigationNode);
    fragment.appendChild(informationNode);

    document.body.querySelector("#root").appendChild(fragment);
}


function addEvent() {
    const url = "http://localhost:8080";

    //navigate to login page
    document.getElementById("user-navigator-button").addEventListener("click", (event) => {
        window.location.href = `${url}/login.html`;
    });
}

render();
addEvent();