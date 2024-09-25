# web-p2-was

# 🔥 우리의 주간 계획서 (1)

## 계획

### 설계 architecture.md 작성

### 로거 (honux: winston 추천)

  - 로거 라이브러리 선택과 기술적 근거 찾기

### 웹 페이지 구현

  - CSS 컬러 및 사이즈 템플릿 선언
  - 리액트 학습
  - 컴포넌트 구현
    - 로그인/회원가입 네비게이터 버튼 컴포넌트 구현
    - 입력 폼 컴포넌트 구현
    - 로그인 및 회원가입 동작 버튼 구현
  - 메인 페이지 구현
  - 로그인(Login) 페이지 구현
  - 회원가입(Register) 페이지 구현
  - 가입 완료 페이지 구현

### NET 모듈 사용해서 HTTP 응답

  - HTTP 모듈의 동작 방식 함께 학습하기

  - 1단계
    - 로거로 Request message를 확인하고, 출력
    - http://localhost:3000/index.html 접속 시 정적 파일 응답

  - 2단계
    - HTTP Request message 구문 분석 후
      - URI에 맞는 응답
      - Content Type 분석 후 응답 지원
        ```
        // 지원할 컨텐츠 타입의 확장자 목록
        html
        css
        js
        ico
        png
        jpg
        ```

  - 3단계
    - 요청에 맞게 회원가입 페이지 반환
    - HTTP GET 요청으로 회원가입 정보 전달 (URI로 유저정보 전달)  
      ex) /create?userId=javajigi&password=password&name=%EB%B0%95%EC%9E%AC%EC%84%B1&email=javajigi%40slipp.net
    - 유저 생성 및 저장 (DB로)

  - 추가 요구 사항
    - 1단계: cluster(멀티 프로세스) 또는 worker thread(멀티 스레드) 활용
    - 3단계: 테스트 라이브러리를 활용해서 단위 테스트를 적용
    

## 📝 구체적인 학습 및 구현 계획

### 월요일
  - 설계 architecture.md 작성
  - CSS 컬러 및 사이즈 템플릿 선언
  - 로거 라이브러리 선택과 기술적 근거 찾기
  - HTTP 모듈의 동작 방식 함께 학습하기

  - 1단계
    - 로거로 Request message를 확인하고, 출력
    - http://localhost:3000/index.html 접속 시 정적 파일 응답


### 화요일

  - 2단계
    - HTTP Request message 구문 분석 후
      - URI에 맞는 응답
      - Content Type 분석 후 응답 지원
        ```
        // 지원할 컨텐츠 타입의 확장자 목록
        html
        css
        js
        ico
        png
        jpg
        ```

### 수요일

  - 웹 페이지 구현
    - 리액트 학습
    - 컴포넌트 구현
      - 로그인/회원가입 네비게이터 버튼 컴포넌트 구현
      - 입력 폼 컴포넌트 구현
      - 로그인 및 회원가입 동작 버튼 구현
    - 로그인(Login) 페이지 구현
    - 회원가입(Register) 페이지 구현
    - 가입 완료 페이지 구현

### 목요일

  - 3단계
    - 요청에 맞게 회원가입 페이지 반환
    - HTTP GET 요청으로 회원가입 정보 전달 (URI로 유저정보 전달)  
      ex) /create?userId=javajigi&password=password&name=%EB%B0%95%EC%9E%AC%EC%84%B1&email=javajigi%40slipp.net
    - 유저 생성 및 저장 (DB로)

### 시간이 남는다면

  - 웹 페이지 구현
    - 메인 페이지 구현

  - 추가 요구 사항
    - 1단계: cluster(멀티 프로세스) 또는 worker thread(멀티 스레드) 활용
    - 3단계: 테스트 라이브러리를 활용해서 단위 테스트를 적용

## ✏️ 고민과 해결 과정 쌓아가기

<details>
<summary>월요일</summary>
<div markdown="1">

### 설계

#### 디렉토리 구조

<img src="https://i.ibb.co/zskgCj8/image.png" alt="architecture">

#### 흐름

<img src="https://i.ibb.co/nD2PSg9/Pasted-image-20240923222932.png"  alt="flow">


### 로거 라이브러리 선택과 기술적 근거 찾기

고민했던 HTTP 로깅 라이브러리들

Morgan - 파일 로깅 기능이 없음, 단순 정상 및 에러 로깅만 지원
Winston - 계층 별 로깅이 가능하고, 다양한 로깅을 지원해서 확장성 면으로 봤을 때 좋아보임
-> Winston이 웹 어플리케이션 전반에 걸친 로그를 남기기에 적합하다고 판단

### 타입스크립트를 이용하기 위해

처음 했던 시도는 .ts 파일을 실행시키기 위해 `ts-node` 패키지를 설치하는 일이었습니다.

```console
npm install ts-node
```

이후 ts 파일을 실행했을 때 아래의 에러를 만나게 되었고,

```
TypeError: Unknown file extension ".ts" -> code: 'ERR_UNKNOWN_FILE_EXTENSION'
```

이에 대한 문제를 확인한 결과 `ts-node` 패키지에서 종종 발생하는 문제임을 확인했습니다.

이에 대한 해결책으로 `ts-node` 패키지 대신 `tsx` 패키지를 설치해 사용함으로써 해결할 수 있었습니다.1단계

```console
//tsx 패키지 설치
npm install tsx

//실행
npx tsx app.ts
```

### Winston으로 로깅하기

우선 winston을 로깅 용도로 사용하기 위해 패키지를 설치해줬습니다.

```console
npm install winston
```

이후 winston을 이용하기 위해 `logger.ts` 파일을 만들어 해당 파일에서 로거를 정의한 이후 사용하도록 작성해봤습니다.

```ts
//logger.ts
import winston from 'winston';

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console()
    ]
});

export { logger }
```

이후 export한 logger를 app.ts에서 응답 확인용으로 사용했습니다.

```ts
//app.ts
import { logger } from './logger';

logger.debug(request);
```

이후 `curl`로 HTTP 요청을 보냈고, 해당 결과를 볼 수 있었습니다.

```
{"level":"debug","message":"GET / HTTP/1.1\r\nHost: localhost:3000\r\nUser-Agent: curl/8.4.0\r\nAccept: */*\r\n\r\n"}
```

### HTTP 요청에 정적 파일 응답하기

HTTP 요청에 정적 파일을 응답해주기 위해서 index.html을 만들어 줬습니다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" crossorigin
      href="https://cdn.jsdelivr.net/npm/reset-css@5.0.2/reset.min.css"
    />
</head>
<body>
  <span> HI </span>
</body>
</html>
```

이후 해당 파일을 읽고, response의 본문으로 응답하기 위해서 fs 모듈로 파일을 읽고, 응답해주는 과정을 수행하려고 했고,

그 과정에서 절대 경로를 지정하기 위해 `fileURLToPath` 모듈과 `path` 모듈을 통해 경로를 생성해줬습니다.

```ts
//app.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const filePath = fileURLToPath(import.meta.url);
const staticFilePath = path.join(filePath, "../../", "static");

            // socket.on(
            const indexHtml = fs.readFileSync(path.join(staticFilePath, "html/index.html"), "utf8");

            socket.write("HTTP/1.1 200 OK\r\n");
            socket.write("Content-Type: text/html\r\n");
            socket.write("\r\n");
            socket.write(indexHtml);
            socket.end();
            ...
```

</div>
</details>

<details>
<summary>화요일</summary>
<div markdown="1">

### HTTP Message 구문 분석하기

이전에 HTTP Message를 로깅하고, HTTP Response Message와 index.html을 응답하는 과정까지 수행했었고,
HTTP Request Message를 전달받았을 때 요청에 대한 내용을 편리하게 이용하고자 HTTP Request 클래스를 정의하게 되었습니다.

```ts
// ./DTO/Request.ts
class Request {
    headers: {[key: string]: string} = {};
    body: string;
    method: string;
    path: string;
    version: string;
    constructor(msg) {
        this.parseMsg(msg);
    }
}
```

HTTP Reqeust Message를 분리할 때 요청에 들어오는 Header와 Body를 분리하고자 했고, Header에서도 StartLine을 구분해 객체의 필드로 저장할 수 있도록 내부 메서드를 만들어줬습니다.

```ts
// ./DTO/Request.ts
    private parseMsg(msg) {
        const [headerMsg, bodyMsg] = msg.split("\r\n\r\n");
        const [startLine, ...requestHeader] = headerMsg.split("\r\n");
        this.body = bodyMsg;
        this.parseStartLine(startLine);
        this.parseHeader(requestHeader);
    }

    private parseStartLine(startLine) {
        [this.method, this.path, this.version] = startLine.split(' ');
    }

    private parseHeader(headerMsg) {
        headerMsg.forEach((line) => {
            const [key, value] = line.split(":");
            this.headers[key] = value.trim();
        });
    }
```


### HTTP Response 정의하기

HTTP Request에 대한 정의가 끝나 이용하기 편한 상태로 만들어줬고, 요청에 따라
index.html 뿐만 아니라 다른 확장자의 파일도 응답해주고자 반복되는 패턴에서 응답 내용만 다르게 생성 가능한 HTTP Response에 대한 모델 객체를 정의하기로 했습니다.

```ts
// ./DTO/Response.ts
export class Response {
    responseMsg:string;
    connection:string;
    constructor(statusCode, connection, ext: string|null = null, body: string|null = null) {
        this.connection = connection;
        this.setStatusLine(statusCode);
        this.setHeaders(connection, ext, body);
    }
}
```

Response 클래스에서는 HTTP Response Message String을 구성하기 위해 인자를 전달받고, 이를 통해 `responseMsg`를 구성하는 내부 메서드들로 구성되어 있습니다. 


### HTTP Response 객체에서 컨텐츠 타입을 지정하는 방법

1. `setHeader`와 같은 메소드를 사용하여 사용자가 직접 헤더에 Content-Type을 지정하기
2. `sendJson`, `sendFile`와 같은 메소드를 생성하여 문자열 전송과 파일 전송을 분리하기
3. 파라미터로 컨텐츠 확장자를 입력받아 처리하기

`Response` 객체에서 파일 시스템에 접근하는 것은 올바르지 않다고 생각하여 2번은 제외했습니다.
또한 사용자가 직접 헤더를 설정하게 되면 예외처리가 번거로워질 것이라 생각하였고, 따라서 3번으로 결정하였습니다.

```ts
// ./DTO/Response.ts

    //setHeaders() {
    if (body) {
        this.responseMsg += `Content-Type: ${contentType[ext]}; charset=UTF-8\r\n`;
        this.responseMsg += `Content-Length: ${body.length}\r\n`;
	}
```


### Response 객체 응답 확인

이후 만들어진 Response 인스턴스의 메시지를 전달했을 때 정상적으로 수신이 되는지 확인해줬습니다.


```
//정상적인 응답
< HTTP/1.1 200 OK
< Server: Web29-A
< Date: Tue, 24 Sep 2024 06:00:58 GMT
< Content-Type: text/html; charset=UTF-8
< Content-Length: 289
< Connection: close
```

```
//잘못된 경로의 응답
< HTTP/1.1 404 Not Found
< Server: Web29-A
< Date: Tue, 24 Sep 2024 06:01:58 GMT
< Connection: close
```

### Router와 Response 객체

express의 router와 유사하게 `Router.requestHandler`에서 파라미터로 `res` 객체를 넘겨 `res.end`와 같은 처리를 하려고 계획했습니다.

1. `response` 객체에서 `socket`을 넘겨 처리하는 방식으로 재구성
2. `req` 객체만 넘기고 Controller에서 `res` 객체 생성 후 반환

현재 `response` 객체의 구현을 변경하지 않도록 2번을 선택했습니다.

```ts
// ./route/Router.ts

  //requestHandler()
    if(exist) return this.route[req.method][routePath](req);
```

### HTTP Path 구분에 관하여

HTTP 요청에 맞게 정적 파일을 응답해주기 위해서 요청의 Path와 method를 구분해 해당 경로에 파일이 존재하는지의 여부와 파일을 응답하는 과정을 수행해야 했습니다.

추후 확장성을 고려해 `route` 라는 디렉토리를 만들어, 경로를 사전에 등록할 수 있게 했고, 등록된 경로를 판단 후 미리 선언된 경로에 등록된 콜백 함수로 Response를 응답할 수 있는 로직을 작성하게 됐는데,

```ts
class Router {
    //경로 보관
    route = {
        "GET": {},
        "POST": {},
        "PUT": {},
        "PATCH": {},
        "DELETE": {},
        "UPDATE": {}
    }
    //경로 설정
    get(path: string, func: Function) {
        this.route.GET[path] = func;
    }
}
```

해당 방법대로 했을 때의 문제가 하나 존재했습니다.

예를 들어 사전에 등록된 Path가 `/`일 경우에 `/html/index.html`과 같이 요청이 들어오는 경우에도 `/` 경로를 통해 등록된 함수를 실행할 수 있도록 만들고 싶었는데

`object` 타입의 key-value 특성 상 요청이 들어온 Path를 통해 key를 대입했을 때 원하는 방식으로 동작할 수 없었고, `/html/index.html` 처럼 하위 Path로 들어오는 경우에 `/`와 같이 등록된 상위 Path의 함수가 동작할 수 있도록 작성해야 했습니다.

```ts
고민한 흔적들
//router.get('path', callback);
//router.requestHandler(req);

// "/"
// '/stylesheets/index.css'

// 해당 path로 라우트에 등록이 되어있는지 검사하는 로직
// 경로를 한 개씩 빼는 로직
//while ->등록 여부 검사  o = 탈출 / x = 한 개 빼는 로직 실행 -> 검사 로직 / 한 개 빼는 로직이 실패할 경우 (root) => 404 탈출

/*
staticRoute['/stylesheets/index.css'] << 검사 
x -> staticRoute['/stylesheets']; << 검사
x -> staticRoute['/'] < 검사
x -> 404

staticRoute['/stylesheets/'] << method 있을 수 있음
staticRoute['/'] << method 있을 수 있음
*/
```

함께 고민한 끝에 `/html/index.html`처럼 들어오는 경로에 대해 경로를 한 개씩 제외하면서 등록된 함수가 있는지 탐색하는 과정을 거치자는 결론에 이르렀고, 아래와 같이 상위 경로에 등록된 함수의 존재 여부를 확인하고, 없다면 경로를 한 개씩 제외하는 로직을 작성할 수 있었습니다.

```ts
    requestHandler(req): Response {
        let routePath = req.path;
        while(true) {
            const exist = this.checkRouteExist(req.method, routePath);
            if(routePath === "/" && !exist) throw new Error("No Route");
            if(exist) return this.route[req.method][routePath](req);
            else routePath = this.reducePath(routePath);
        }
    }

//해당 경로로 등록된 method가 존재하는지 판단하는 함수
    private checkRouteExist(method, path) {
        const callback: Function | null = this.route[method][path];
        return callback != null;
    }

//경로를 한 개씩 제외하는 함수
    private reducePath(path) {
        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        
        const lastSlashIndex = path.lastIndexOf('/');

        if(lastSlashIndex === - 1){
            return '/';
        }
        return path.substring(0, lastSlashIndex + 1);
    }
```


### staticController 구현

정적 파일을 서빙하는 컨트롤러를 구현했습니다.
`req.path`를 이용하여 서빙할 정적 파일의 경로를 확인하고,
파일이 존재할 경우 Response 객체에 담아 리턴하는 방식을 사용하였습니다.
기본경로 `/`는 `index.html`을 반환하도록 하였습니다.

```ts
const filePath = path.join(staticFilePath,  req.path === '/' ? 'html/index.html' : req.path);
    const ext = path.extname(filePath);
    if(fs.existsSync(filePath)){
        const file = fs.readFileSync(filePath,'utf-8');
        const response = new Response(200, req.headers.Connection ?? "close", ext, file);
        return response;
    }
    const response = new Response(404, req.headers.Connection ?? "close");
    return response;
```

### 정적 파일 응답 결과
<img src="https://i.postimg.cc/4N47dzhS/2024-09-24-6-39-23.png" alt="2024-09-24-6-34-42" 
 width=350px>

</div>
</details>

### 브라우저 화면 구현하기

프론트엔드 코드를 작성하기 이전에 저희는 고민을 했습니다.

이전에 템플릿 엔진으로 SR을, 바닐라 자바스크립트, html, CSS를 이용해 CSR을 경험해봤는데 
학습을 위해 제약이 있는 서버측 코드와 달리 제약이 없는 프론트엔드 파트에서도 새로운 도전을 해볼 수 있지 않을까? 라는 고민이었습니다.

구현해야 할 웹 페이지 디자인을 봤을 때 재사용하는 컴포넌트가 굉장히 많아 보였고,
어떻게 구현해도 제약이 없다는 점 때문에 평소에 경험해보지 않았던 리액트를 사용해보자는 의견이 나왔습니다.

해당 의견에 모두가 재밌는 경험일 것이라고 생각해 브라우저 화면 렌더링에 리액트를 사용하기로 결정했습니다.

### 리액트 환경 구성

리액트를 이용하기 위해 기존에 구성했던 서버 디렉토리 구조를 `src`에서 `BE`라는 이름으로 리네이밍을 했고,
리액트 환경 구성을 위해 Vite 빌더를 이용해 리액트 환경을 `FE`라는 디렉토리로 생성해 줬습니다.

```console

npm create vite@latest

✔ Project name: FE
✔ Select a framework: › React
✔ Select a variant: › TypeScript

cd FE

npm install

npm run dev
```

### 컴포넌트 작성

전체 화면을 구성하기 이전에 디자인을 토대로 재사용되는 컴포넌트들을 먼저 작성하기로 했습니다.

대표적으로 입력 폼, 네비게이터, 버튼이 재사용됨을 확인했고 

해당 컴포넌트와 적용될 stylesheets를 작성해줬씁니다.

```tsx
// FE/src/components/Button.tsx
const Button: React.FC<ButtonProps> = ({ text, size, onClick, disabled = false }) => {
  return (
    <button 
      className={`button ${size}`} 
      onClick={onClick} 
      disabled={disabled}
    >
      {text}
    </button>
  );
};
```

```tsx
// FE/src/components/InputBox.tsx
const InputBox: React.FC<InputBoxProps> = ({
    label,
    type,
    placeholder,
    value,
    onChange,
    required = true,
}) => {
    return(
        <div className = "input-container" >
            <label>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    )
};
```

로그인과 회원가입을 위한 위 두 가지 컴포넌트를 생성했고,

해당 컴포넌트들이 배치될 프레임을 컴포넌트로 만들었습니다.

```tsx
// FE/src/components/Frame.tsx
const Navigation: React.FC<NavigationProps> = ({title, children}) => {
    return (
        <div className="navigation">
            <h3>{title}</h3>
            {children}
        </div>
    );
}

const Information: React.FC<TitleProps> = ({title}) => {
    return (
        <div className="information">
            <h1>{title}</h1>
        </div>
    );
}

const HugFrame: React.FC<{children: React.ReactNode }> = ({children}) => {
    return (
        <div className="hug-frame">
            {children}
        </div>
    );
}
```

실제로 사용되는 모습은 아래처럼 구성중입니다.

```tsx
// FE/src/main.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  </StrictMode>,
)

// FE/src/layouts/Login.tsx
const Login: React.FC = () => {
      return (
        <>
            <Navigation title="HELLO, WEB!">
                <Button text="로그인/회원가입" size="small" onClick={navigateToRegister} />
            </Navigation>
            <Information title="로그인" />
            <HugFrame>
                <InputBox label="이메일" type="email" placeholder="이메일을 입력해주세요" value={email} onChange={(e) => setEmail(e.target.value)} />
                <InputBox label="비밀번호" type="password" placeholder="비밀번호를 입력해주세요" value={password} onChange={(e) => setPassword(e.target.value)} />
            </HugFrame>
            <HugFrame>
                <Button text="로그인" size="large" onClick= {fetchLogin}/>
                <span className='signup-info'>
                  아직 회원가입을 안하셨나요?
                  <a href="http://localhost:5417/signup" className="text-link"> 회원가입하기</a>
                </span>
            </HugFrame>
        </>
    );
}
```

### 만들어진 결과 (회원가입 페이지)

<img src="https://i.ibb.co/JqWJtt5/image.png" alt="register">

이번 주를 계획할 때는 가입 완료 페이지도 따로 만들 계획을 세웠지만,
로그인 페이지와 기능이 동일하기 때문에 기존 로그인 페이지를 재활용해 리디렉션 후 
DOM Object를 수정하는 방향으로 결정했습니다.

