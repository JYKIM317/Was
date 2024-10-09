import { LargeButton, SmallButton } from "../components/Button.js";
import { InputBox } from "../components/InputBox.js";
import { Navigation, Information, VerticalHugFrame } from "../components/Frame.js";

function render() {
    const navigationNode = document
        .createRange()
        .createContextualFragment(Navigation("HELLO, WEB!", [SmallButton("로그인/회원가입", "user-navigator-button")]));
    const informationNode = document.createRange().createContextualFragment(Information("회원가입"));
    const loginInputFrameNode = document.createRange().createContextualFragment(VerticalHugFrame("login-frame", [
        InputBox("input-name", "닉네임", "text", "닉네임을 입력해주세요"),
        InputBox("input-email", "이메일", "email", "이메일을 입력해주세요"),
        InputBox("input-password", "비밀번호", "password", "비밀번호를 입력해주세요")
    ]));
    const loginButtonFrameNode = document.createRange().createContextualFragment(VerticalHugFrame("login-frame", [
        LargeButton("회원가입", "register-button"),
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

    //register fetch
    document.getElementById("login-button").addEventListener("click", async (event) => {
        const name = document.getElementById("input-name").querySelector("input").value.trim();
        const email = document.getElementById("input-email").querySelector("input").value.trim();
        const password = document.getElementById("input-password").querySelector("input").value.trim();

        if (name !== "" && email !== "" && password !== "") {
            await fetch(`${url}/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name })
            });
        }
    });

    //navigate to login page
    document.getElementById("user-navigator-button").addEventListener("click", (event) => {
        window.location.href = `${url}/login.html`;
    });
}

render();
addEvent();