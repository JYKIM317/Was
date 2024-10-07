import { LargeButton, SmallButton } from "../components/Button.js";
import { InputBox } from "../components/InputBox.js";
import { Navigation, Information, HugFrame } from "../components/Frame.js";

/*
  const fetchRegister = async () => {
    await fetch(`${baseURL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name })
    });
  }
*/

const fragment = document.createDocumentFragment();

const navigationNode = document
    .createRange()
    .createContextualFragment(Navigation("HELLO, WEB!", [SmallButton("로그인/회원가입", "login-navigator-button")]));
fragment.appendChild(navigationNode);

const informationNode = document.createRange().createContextualFragment(Information("회원가입"));
fragment.appendChild(informationNode);

const loginInputFrameNode = document.createRange().createContextualFragment(HugFrame("login-frame", [
    InputBox("input-name", "닉네임", "text", "닉네임을 입력해주세요"),
    InputBox("input-email", "이메일", "email", "이메일을 입력해주세요"),
    InputBox("input-password", "비밀번호", "password", "비밀번호를 입력해주세요")
]));
fragment.appendChild(loginInputFrameNode);

const loginButtonFrameNode = document.createRange().createContextualFragment(HugFrame("login-frame", [
    LargeButton("회원가입", "register-button"),
]));
fragment.appendChild(loginButtonFrameNode);

document.body.querySelector("#root").appendChild(fragment);
