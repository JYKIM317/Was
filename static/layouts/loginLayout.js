import { LargeButton, SmallButton } from "../components/Button.js";
import { InputBox } from "../components/InputBox.js";
import { Navigation, Information, HugFrame } from "../components/Frame.js";

/*
    const fetchLogin = async () => {
        await fetch(`${baseURL}/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
    }
*/

const fragment = document.createDocumentFragment();

const navigationNode = document
    .createRange()
    .createContextualFragment(Navigation("HELLO, WEB!", [SmallButton("로그인/회원가입", "login-navigator-button")]));
fragment.appendChild(navigationNode);

const informationNode = document.createRange().createContextualFragment(Information("로그인"));
fragment.appendChild(informationNode);

const loginInputFrameNode = document.createRange().createContextualFragment(HugFrame("login-frame", [
    InputBox("input-email", "이메일", "email", "이메일을 입력해주세요"),
    InputBox("input-password", "비밀번호", "password", "비밀번호를 입력해주세요")
]));
fragment.appendChild(loginInputFrameNode);

const registerRouteText = `<span className='signup-info'>
                    아직 회원가입을 안하셨나요?
                    <a href="http://localhost:8080/register" className="text-link"> 회원가입하기</a>
                </span>`;
const loginButtonFrameNode = document.createRange().createContextualFragment(HugFrame("login-frame", [
    LargeButton("로그인", "login-button"),
    registerRouteText
]));
fragment.appendChild(loginButtonFrameNode);

document.body.querySelector("#root").appendChild(fragment);
