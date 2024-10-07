import { SmallButton } from "../components/Button.js";
import { Navigation, Information } from "../components/Frame.js";

const fragment = document.createDocumentFragment();

const navigationNode = document
    .createRange()
    .createContextualFragment(Navigation("HELLO, WEB!", [SmallButton("로그인/회원가입", "login-navigator-button")]));
fragment.appendChild(navigationNode);

const informationNode = document.createRange().createContextualFragment(Information("부스트캠프 백엔드 교육용 페이지", "main-information", ["<h2>HELLO, WEB! 입니다.</h2>"]));
fragment.appendChild(informationNode);

document.body.querySelector("#root").appendChild(fragment);
