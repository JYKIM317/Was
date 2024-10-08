import { LargeButton, SmallButton } from "../components/Button.js";
import { InputBox } from "../components/InputBox.js";
import { Navigation, Information, HugFrame } from "../components/Frame.js";

function render() {
    const navigationNode = document
        .createRange()
        .createContextualFragment(Navigation("HELLO, WEB!", [SmallButton("로그인/회원가입", "user-navigator-button")]));

    const informationNode = document.createRange().createContextualFragment(Information("로그인"));
    const loginInputFrameNode = document.createRange().createContextualFragment(HugFrame("login-frame", [
        InputBox("input-email", "이메일", "email", "이메일을 입력해주세요"),
        InputBox("input-password", "비밀번호", "password", "비밀번호를 입력해주세요")
    ]));
    const registerRouteText = `<span className='signup-info'>
                    아직 회원가입을 안하셨나요?
                    <a href="http://localhost:8080/register.html" className="text-link"> 회원가입하기</a>
                </span>`;
    const loginButtonFrameNode = document.createRange().createContextualFragment(HugFrame("login-frame", [
        LargeButton("로그인", "login-button"),
        registerRouteText
    ]));

    const fragment = document.createDocumentFragment();
    fragment.appendChild(navigationNode);
    fragment.appendChild(informationNode);
    fragment.appendChild(loginInputFrameNode);
    fragment.appendChild(loginButtonFrameNode);

    document.body.querySelector("#root").appendChild(fragment);
}

function addEvent() {
    const url = "http://localhost:8080";

    //login fetch
    document.getElementById("login-button").addEventListener("click", async (event) => {
        const email = document.getElementById("input-email").querySelector("input").value.trim();
        const password = document.getElementById("input-password").querySelector("input").value.trim();

        if (email !== "" && password !== "") {
            await fetch(`${url}/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            }).then((response) => {
                const isOK = 200;
                if (response.status === isOK) return response.json();
            }).then((json) => {
                if (json != null) window.location.href = json.redirect;
            });
        }
    });

    //navigate to register page
    document.getElementById("user-navigator-button").addEventListener("click", (event) => {
        window.location.href = `${url}/register.html`;
    });
}

render();
addEvent();