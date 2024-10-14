
# 🔥 나만의 주간 계획서 (4)

## ✅ 나만의 체크포인트 ⭕❌

⭕ 주간 계획 수립

❌ 게시판 기능 완성
	
	⭕ 게시판 레이아웃 구성
    - 서버 측 게시판 데이터 반환 로직 작성
    - 게시판 데이터 받아오는 함수 작성
    - 메인 페이지 게시판 HTML 렌더링 구현
    - 메인 페이지 게시판 CSS 구현
	
	❌ 메인 하단에 글쓰기 버튼 추가
		- 글쓰기 버튼 시 write.html로 이동
		- 만약 비로그인 유저라면 로그인 페이지로 이동
	
	❌ write.html에서는 글을 입력할 수 있도록
	
	❌ 로그인한 사용자가 글 제목 클릭시 세부 내용을 볼 수 있는 페이지로 이동
		- 만약 비로그인 유저라면 로그인 페이지로 이동

❌ 글쓰기 이미지 업로드 기능 구현
	
	❌ 이미지 업로드 버튼 구현
	
	❌ 이미지 업로드 구현
	
	❌ 서버에 이미지 파일 저장
	
	❌ 이미지 요청에 대한 응답 구현
	
	❌ 글 본문 이미지 표시

❌ Github 로그인 구현
	
	❌ Github 로그인 버튼 구현
	
	❌ Github 인증 구현
	
	❌ Github 리디렉션 및 프론트 로직 구현

❌ 테스트 코드 작성
	
	❌ HTTP Message에 대한 테스트 코드 작성
	
	❌ 비즈니스 로직에 대한 테스트 코드 작성
	
	❌ 인증 로직 테스트 코드 작성

## 📝 학습 및 구현 계획

### 월요일

게시판 기능 완성
	
	게시판 레이아웃 구성
	
	메인 하단에 글쓰기 버튼 추가
		- 글쓰기 버튼 시 write.html로 이동
		- 만약 비로그인 유저라면 로그인 페이지로 이동
	
	write.html에서는 글을 입력할 수 있도록
	
	로그인한 사용자가 글 제목 클릭시 세부 내용을 볼 수 있는 페이지로 이동
		- 만약 비로그인 유저라면 로그인 페이지로 이동

### 화요일

글쓰기 이미지 업로드 기능 구현
	
	이미지 업로드 버튼 구현
	
	이미지 업로드 구현
	
	서버에 이미지 파일 저장
	
	이미지 요청에 대한 응답 구현
	
	글 본문 이미지 표시

### 수요일

Github 로그인 구현
	
	Github 로그인 버튼 구현
	
	Github 인증 구현
	
	Github 리디렉션 및 프론트 로직 구현

### 목요일

일정에 맞췄을 시 리팩토링 및 추가 기능 구현 혹은 테스트 코드 작성

## ✏️ 고민과 해결 과정 쌓아가기

### 피드백 개선

#### 상수 네이밍 대문자 스네이크 케이스로 변경

```ts
//변경 전
const alg = 'aes-256-cbc';
const encryptedKey = crypto.randomBytes(32);
const initializeVector = crypto.randomBytes(16);
...등

//변경 이후
const ALG = 'aes-256-cbc';
const ENCRYPTED_KEY = crypto.randomBytes(32);
const INITIALIZE_VECTOR = crypto.randomBytes(16);
...등
```

#### 비밀번호 암호화 bcrypt로 변경 

md5는 안전한 암호화 방식이 아니라는 의견을 들을 수 있었습니다.
암호화 방식을 sha 방식으로 바꿀지, bcrypt 방식으로 바꿀지 고민했는데 느리지만 조금 더 안전한 bcrypt 방식으로 바꾸자 했습니다.

```ts
//기존 PW 암호화
//For password encryption
function md5Encryption(data) {
    return crypto.createHash("md5").update(data + process.env.SECRET).digest("hex");
}
```

```ts
//변경된 PW 암호화
//For password encryption
function passwordEncryption(data) {
    return bcrypt.hashSync(data, process.env.SECRET);
}
```

#### 반복되는 문자열 상수화

```ts
//개선 전
header += `Content-Type: application/json\r\n`;
...

//개선 후
//const.ts
const CRLF = "\r\n";
//Response.ts
header += `Content-Type: application/json${CRLF}`;
...
```

#### 문자열 연결 로직 변경

```ts
//기존 Authorization.ts
const secretOfToken = encrypt(process.env.SECRET);
const bodyOfToken = encrypt(JSON.stringify(body));
const integrityTag = createIntegrityTag(process.env.SECRET, JSON.stringify(body));

const token = `${secretOfToken}.${bodyOfToken}.${integrityTag}`;
```

```ts
//변경 Authorization.ts
const token = [
	encrypt(process.env.SECRET),
	encrypt(JSON.stringify(body)),
	createIntegrityTag(process.env.SECRET, JSON.stringify(body))
].join('.');
```

### 메인 페이지 게시판 레이아웃

우선 게시글의 데이터를 어떻게 가져오면 좋을까? 를 고민했습니다. 

가져와야 하는 것
- 해당 페이지 글 목록
  `localhost:8080/board/post?p=1`

post_id를 기준으로 내림차순 한 페이지당 10개 씩, 5페이지 단위의 존재 여부를 보여줄 예정입니다.

서버 측 데이터 반환을 구현하기 위해 라우터를 새롭게 만들어 경로를 등록해줬고,

```ts
//boardRouter.ts
const boardRouter = new Router();
  
boardRouter.get("/board/post", boardController);
boardRouter.post("/board/post/:postId", postController);
boardRouter.post("/board/comment/:postId", commentController);

//app.ts
routeStack.use("/board", boardRouter);
```

아래같은 구조로 쿼리를 발생할 수 있도록 만들기 위해

```sql
SELECT * 
FROM post
ORDER BY createdAt DESC
LIMIT 10 
OFFSET page * 10;
```

PostRepository와 메서드를 선언해줬습니다.

```ts
//PostRepository.ts
class PostRepository {
    static TABLE_NAME = "post";

    static async getBoard(page) {
	    const SELECT_PAGE = page * 10 - 10;
	    
        return await DBManager.select({
            table: this.TABLE_NAME,
            column: "*",
            orderBy: "createdAt",
            desc: true,
            limit: 10,
            offset: SELECT_PAGE
        });
    }
}
```

이후 데이터를 받아와 반환해주는 함수를 작성해줬습니다.

```ts
//postController.ts
async function boardController(req, res) {
    try {
        const page = req.query.p;
        PostRepository.getBoard(page).then((response) => {
            const result = response[0];
            res.setStatus(200).json({ result });
        });
    } catch (e) {
        logger.error(e);
        res.setStatus(500).send();
    }
}
```

클라이언트에선 게시판 글을 불러오는 함수를 작성해줬고, 이를 호출해서 사용할 예정입니다.

```js
// /scripts/board.js
async function getBoardPage(page) {
    const uri = url + `/board/post?p=${page}`;
    return await fetchGET(uri).then((response) => {
        const isOK = 200;
        return response.status === isOK ? response.json() : { result: [] };
    });
}
```

게시판이 렌더링될 `mainLayout`에서 받아온 게시글 데이터를 통해 게시판을 렌더링하고 각 게시글의 상위 프레임인 `board`에 이벤트를 등록해 이벤트 버블링을 통한 이벤트 감지와, 해당 클릭 이벤트를 처리할 예정입니다.

```js
//mainLayout.js
async function render() {
	//게시판
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
...

function addEvent(isLogin) {
	...
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
```


<details>
<summary>1주차</summary>
<div markdown="1">

## dev 시작하기
```terminal
cd FE

npm install

npm run build

cd ../BE

npm install

docker compose up

nodemon
```
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


<details>
<summary>수요일</summary>
<div markdown="1">


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

</div>
</details>


<details>
<summary>목요일</summary>
<div markdown="1">

### path에 동적 경로가 있을 경우에 해결 방법

사실 미션과는 관계 없는 부분이긴 했지만 router를 구현한 이상 route에 동적 경로를 설정했을 때
어떻게 처리할 수 있을지에 대한 고민도 함께 수반되어야 했습니다.

이 과정에서 함께 많은 시간을 고민했고, 최종적으로 아래와 같은 제안이 나오게 되었습니다.

```
/*
제안하고 싶은 부분

1. path가 라우터에 등록될 때 `:` 로 시작하는 경우 뒤의 문자열을 날려서 변수 Path임을 파악할 수 있게 만드는 로직 작성
   
2. request path에 대해 모든 경우의 수를 만드는 로직 작성  
   ex) /user/data -> /user/:, /:/data, /:/:  
(경우의 수 만들 때 변수 : 로 변환되는 Path는 따로 parameters로 저장되어야 함)

3. 경우의 수로 route 탐색하도록 변경
   
4. parameters를 분리해서 반환하는 함수 만들기 (편집됨)
*/
```

위와 같이 정리했을 때 대부분은 구현을 간단하게 할 수 있었지만 
2.request path에 대해 모든 경우의 수를 만드는 로직 작성 를 만드는 과정이 조금 복잡해졌는데

path를 각각 분리한 이후 모든 자리에 `:`으로 변환하며 path를 다시 재조합해 저장하는 과정과,
해당 동적 경로로 변환된 자리의 값을 parameter로 저장하는 과정,
`:`의 개수로 우선 순위를 둬 정렬하는 로직까지 포함되어

실제로 아래의 로직이 `/user/jinyoung` 과 같이 요청이 들어온다면
`/:/jinyoung, /user/:, /:/:`처럼 경우의 수를 생성합니다.

```ts
    private createCaseOfRoute(pathList: Array<string>) : Route[] {
        const caseResult: Route[] = [];
        
        pathList.forEach((_, index) => {
            const tempPathList = [...pathList];
            let tempParameters: Array<string> = [];
            for(let idx = index; idx >= 0; idx--) {
                tempPathList[idx] = ":";
                tempParameters.push(pathList[idx]);

                const parameters = [...tempParameters];
                const path = "/" + tempPathList.join("/");
                caseResult.push({path, parameters});
            }
            tempParameters = [];
        });
        caseResult.push({path: "/" + pathList.join("/"), parameters: []});
        
        const sortedCaseResult = this.sortCaseOfRoutes(caseResult);
        return sortedCaseResult;
    }
```

만들고 보니 로직이 너무 복잡해진 것 같아서 이를 개선할 수 없을까? 에 대한 질문을 던지게 되었고, 실제 많은 프레임워크에서는 동적 경로에 대한 처리를 어떻게 하고 있는지 알 수 있었습니다.

하지만 당장에 개선할 부분은 아닌 것 같아서, 이후에 구현보다 개선에 집중하는 순간이 온다면 반드시 개선하고 싶다고 생각했습니다.

나중에 개선한다면?
https://dear-sawfish-e55.notion.site/1-10dd6568ef4b803f8e23cf39bac56c20


### router를 분리했을 때 요청으로 들어온 경로를 어떤 router에 연결할 것인가

각 기능별로 라우터를 분리하였을 때, 엔트리포인트인 `app.ts`에서 `request.path`에 적합한 `Router` 객체를 어떤 방식으로 매칭할 지에 대한 고민이 있었습니다.
실제 express에서는 전역미들웨어를 통해 위의 문제를 처리하지만, 저희는 미들웨어를 구현하기는 무리가 있다고 판단하여 `RouteStack`에서 이를 처리하기로 하였습니다.


```ts
// ./route/RouteStack.ts

class RouteStack {
    routes: Array<{ [key: string]: Router }> = [];

    use(route, router) {
        this.routes.push({[route]: router});
        this.routes.sort((a, b) => {
            const aKey = Object.keys(a)[0];
            const bKey = Object.keys(b)[0];
            
            return bKey.length - aKey.length
        });
    }

    find(path) {
        for(let i = 0; i < this.routes.length; i++) {
            const routePath = Object.keys(this.routes[i])[0];
            if(path.startsWith(routePath))
                return this.routes[i][routePath];
        }
        return null;
    }
}
```

`RouteStack`의 `routes` 프로퍼티에는 `{경로: 해당 라우터 객체}`가 배열에 담겨있습니다.
처음 `RouteStack`에서 `use` 메소드를 이용하여 라우터 객체를 등록하게 되면 `경로`의 길이를 기준으로 `routes` 배열을 정렬하게 됩니다.

`find` 메소드의 경우 `request.path`를 기준으로 `routes` 배열에서 적절한 라우터 객체를 찾아 반환해주게 됩니다.

처음에 `request.path`와 라우터 객체를 어떻게 매칭 시킬 것인가에 대한 고민이 많았습니다.
실제 express의 라우터에서는 등록된 순서대로 경로를 매칭하게 되지만, 저희는 이 기능의 필요성에 대해 의문을 가졌고
이러한 방식 대신 `Longest prefix matching` 방식을 이용하여, 배열 정렬을 사용한 더 단순한 구조를 채택하였습니다.



### 리액트 빌드

최소한의 동작 확인을 위한 FE 구성이 끝나고, 이를 빌드해서 서버에서 배포할 수 있도록 만들어야 했습니다.
vite로 리액트에 관한 환경 구성을 쉽게 할 수 있었기 때문에 빌드 또한 vite를 이용할 수 있었습니다.

```console
npm run build
```

### Docker 사용하기

회원가입 로직 구현을 위해서 DB에 데이터를 저장하기 위한 설치와 연결이 필요했습니다.

처음에는 사용할 DBMS로 MySQL을 어디에 설치하면 좋을까? 고민했고, 선택지가 다양하게 있었습니다.

1. VM을 이용해 가상 환경에 설치 후 연결
2. AWS같은 클라우드에 설치 후 연결
3. Docker를 이용해 로컬에 설치 후 연결

VM을 이용하여 연결하는 것은 현재 프로젝트를 공유하고 있는 로컬 PC의 용량적 한계 때문에 수행하지 못한다고 판단했고,

클라우드의 경우 현재 3인이서 한 개의 로컬 PC에서 공유하며 프로젝트를 수행하고 있기 때문에 이후에 개인으로 분할됐을 때 활용하기 어렵다고 판단했습니다.

Docker를 사용한 이유 
1. VM보다 성능 상 이점,
2. 도커 허브에서 컨테이너 이미지를 이용해 보다 간편한 환경 구성이 가능


`docker-compose.yml`과 `Dockerfile`을 생성해 간편하게 환경을 구성할 수 있었고, 연결 또한 문제 없이 수행할 수 있었습니다.

```
docker compose up
docker ps //현재 실행중인 컨테이너
docker ps -a //전체 컨테이너
docker start [CONTAINER ID]
```

```
# ./Dockerfile

# MySQL 공식 이미지를 기반으로 생성
FROM mysql:latest

# 환경 변수 설정
ENV MYSQL_ROOT_PASSWORD=0000
ENV MYSQL_DATABASE=db1004
ENV MYSQL_USER=zizone
ENV MYSQL_PASSWORD=ganzi
COPY ./init.sql /docker-entrypoint-initdb.d/

# MySQL의 기본 포트(3306) 노출
EXPOSE 3306

# MySQL 서버 실행
CMD ["mysqld"]

```

lmysql의 공식 이미지를 사용하였습니다.
환경 변수의 경우 추후 `docker-compose.yml`에서 받아오도록 개선할 예정입니다.


```
# ./docker-compose.yml

version: '3.8'

services:
  db:
    image: p2-was-db
    build:
      context: .
      dockerfile: Dockerfile
    container_name: p2-was-mysql
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: "0000"
      MYSQL_DATABASE: "db1004"
      MYSQL_USER: "zizone"
      MYSQL_PASSWORD: "ganzi"
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

```

`volumn` 연결을 통해 `init.sql`을 컨테이너로 전달시켜 DB가 자동으로 초기화 되도록 하였습니다.
추후 보안을 위해 도커 관련 파일에서도 `.env` 파일을 사용할 예정입니다.


### DB 연결

도커를 통해 MySQL을 이용할 수 있는 환경을 구성해줬고, 서버에서도 MySQL에 연결할 수 이도록 만들어 줬습니다.

```console
npm install mysql2
```

이후 DB와 연결해 커넥션 풀을 만들어줄 클래스 `DB1004`를 만들어 repository에서 접근할 수 있도록 만들어줬습니다.

```ts
class DB1004 {
    connectionPool: mysql.Pool;
    constructor() {
        dotenv.config();
        this.connectionPool = mysql.createPool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT!),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
}
```

추가적으로 `query`, `select`, `insert`, `delete`, `update`와 같이 DB에 직접 접근하는 기능들은 `dao` 디렉토리에 존재해야 한다고 생각했기에 `DB1004` 클래스 내부에 각 메소드들을 구현하였습니다.

```ts
// ./dao.db1004.ts
// class DB1004
  async #query(query, values = null) {
          const connection = await this.connectionPool.getConnection();
          const result = connection.query(query, values);
          connection.release();
          return result;
      }
```


### 회원가입 로직 구현

회원가입의 경우 `userRouter`와 `userController`에서 담당하게 됩니다.
`/user/register/{query}` 엔드포인트로 접속하게되면, `userRouter` 객체의 `parseQueryString` 메소드를 이용하여 쿼리를 파싱합니다.
이를 `request` 객체에 담아 `userController`로 넘기게 되고, 컨트롤러에서는 `dao`를 이용하여 DB의 `users` 테이블에 레코드를 추가합니다.
현재는 컨트롤러 단에서 `dao`에 직접 접근하고 있지만, 추후 `repository` 계층을 추가할 예정입니다.


</div>
</details>


</div>
</details>



<details>
<summary>2주차</summary>
<div markdown="1">

# 🔥 나만의 주간 계획서 (2)

## ✅ 나만의 체크포인트 ⭕❌

⭕ POST로 회원가입

	⭕ HTTP Message Body Parser 구현

	⭕ Body Length와 HTTP Header Content-Length 가 같은지 검사하는 로직 구현 (400 Bad Request)

	⭕ 서버 측 회원가입 비즈니스 로직 구현

	⭕ 성공 시, 실패 시 응답 구현 

		- 성공 시 로그인 페이지로 Redirection (302)
		- 실패 시 서버 에러 응답

⭕ VM 환경의 DB와 연동

⭕ 쿠키를 이용한 로그인

	⭕ 로그인 성공 시 서버에서 쿠키에 SID 설정해서 응답

	⭕ HTTP Message 쿠키 검사 로직 추가

	⭕ HTTP Message 쿠키를 활용할 수 있도록 변경

	⭕ Session 저장

	❌ 쿠키의 SID와 세션을 이용해 로그인 유지 기능 추가

	❌ 로그아웃 요청 시 세션 및 쿠키 삭제 로직 추가

⭕ 라우트 방식 개선

❌ 리액트에서 바닐라로 FE 사양 변경 

	❌ 리액트에서 구현한 컴포넌트를 템플릿 리터럴 방식으로 변환

	❌ 전체 페이지를 리액트에서 바닐라로 변환

	❌ 웹 프론트 이벤트 및 기능 Script로 변환

❌ 웹 프론트 구현

	❌ 메인 페이지 구현

❌ 테스트 코드 작성

  ⭕ Jest와 TS에 관한 테스트 환경 구성

	❌ Jest 세부 기능 학습

	❌ HTTP Message에 대한 테스트 코드 작성
  
	❌ 비즈니스 로직에 대한 테스트 코드 작성


## 📝 학습 및 구현 계획

### 월요일

- VM 환경의 DB와 연동

- POST로 회원가입
	- HTTP Message Body Parser 구현
	- Body Length와 HTTP Header Content-Length 가 같은지 검사하는 로직 구현 (400 Bad Request
	- 서버 측 회원가입 비즈니스 로직 구현
	- 성공 시, 실패 시 응답 구현 
		- 성공 시 로그인 페이지로 Redirection (302)
		- 실패 시 서버 에러 응답

- 라우트 방식 개선

### 화요일

- 쿠키를 이용한 로그인
	- 로그인 성공 시 서버에서 쿠키에 SID 설정해서 응답
	- HTTP Message 쿠키 검사 로직 추가
	- HTTP Message 쿠키를 활용할 수 있도록 변경
	- Redis를 이용해 Session 저장
	- 쿠키의 SID와 Redis를 이용해 로그인 유지 기능 추가
	- 로그아웃 요청 시 세션 및 쿠키 삭제 로직 추가
 
### 수요일

- Custom Error 구현
  
- 리액트에서 바닐라로 FE 사양 변경 
	- 리액트에서 구현한 컴포넌트를 템플릿 리터럴 방식으로 변환
	- 전체 페이지를 리액트에서 바닐라로 변환
	- 웹 프론트 이벤트 및 기능 Script로 변환

- 웹 프론트 구현
	- 메인 페이지 구현

### 목요일

- 테스트 코드 작성
	- Jest 세부 기능 학습
	- HTTP Message에 대한 테스트 코드 작성
	- 비즈니스 로직에 대한 테스트 코드 작성

## ✏️ 고민과 해결 과정 쌓아가기

<details>
<summary>월요일</summary>
<div markdown="1">

### VM 환경의 DB와 연동

기존에 Docker로 로컬에 DB환경을 구성했지만 원격 환경을 이용하기 위해 VM에 설치한 MySQL로 마이그레이션을 진행하기로 했습니다.

환경만 VM으로 옮기는 것이었기 때문에 크게 달라진 사항은 없었고, DB연결만 VM으로 옮기기 위해 포트포워딩함으로 마이그레이션 할 수 있었습니다.

```console
>mysql
CREATE DATABASE IF NOT EXISTS db1004;

USE db1004;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email varchar(50),
  name varchar(50),
  password varchar(200)
);
```

새롭게 만들어준 DB에 접근할 수 있는 유저 계정이 필요해서 권한 부여와 함께 생성해줄 수 있었습니다.

```sql
-- 유저 생성
CREATE USER 'atach_express'@'%' IDENTIFIED BY 'mypassword';

-- 권한 부여
GRANT ALL ON db1004.* TO 'atach_express'@'%';
-- 변경된 설정 반영
FLUSH PRIVILEGES;
```

### POST로 회원가입

우선 기존 GET 메소드를 이용해 URI에 회원가입 정보를 포함하던 것과 다르게 POST를 이용해 데이터를 전달해야 했습니다.

```tsx
//기존 FE/src/layouts/Register.tsx
  const fetchRegister  = async () => {
    await fetch(`${baseURL}/user/register?email=${email}&password=${password}&name=${name}`, {
        method: "GET"
    });
  }
```

```tsx
//변경 FE/src/layouts/Register.tsx
  const fetchRegister = async () => {
    await fetch(`${baseURL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name })
    });
  }
```

결과도 정상적으로 잘 들어오는 것을 확인했습니다.

```JSON
{
  headers: {
    Host: 'localhost',
    Connection: 'keep-alive',
    'Content-Length': '65',
    'sec-ch-ua-platform': '"Windows"',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
    'Content-Type': 'application/json',
    'sec-ch-ua-mobile': '?0',
    Accept: '*/*',
    Origin: 'http',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    Referer: 'http',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
  },
  body: '{"email":"augu202@naver.com","password":"000","name":"김진영"}',
  method: 'POST',
  path: '/user/register',
  version: 'HTTP/1.1',
  params: [],
  query: {}
}
```

이후 Request의 Content-Type이 application/json일 경우에 Body를 object 타입으로 전환해주는 로직을 작성했습니다.

```ts
// BE/dto/Request.ts
//Request { 
    private parseBody(bodyMsg) {
        const contentJSON = 'application/json';
        if (this.headers["Content-Type"] === contentJSON) {
            this.body = JSON.parse(bodyMsg);
        } else {
            this.body = bodyMsg;
        }
    }
```

기존에 GET 메소드에 관한 경로 지정만 구현되어 있던 Router에 post를 추가해줬습니다.

```ts
// BE/route/Router.ts
//Router {
    post(path: string, func: Function) {
        const pathList = this.separatePath(path);
        const dynamicPath = this.convertToDynamicPath(pathList);
        this.route.POST[dynamicPath] = func;
    }
```

이후 정상적으로 POST 요청이 발생했을 때 DB에 저장됨을 확인했습니다.

</div>
</details>

<details>
<summary>화요일</summary>
<div markdown="1">

### 라우트 방식 개선

기존의 Route에서 동적 경로임을 확인하는 방법은 HTTP Request가 왔을 때 해당 경로로 만들 수 있는 모든 동적 경로 경우의 수를 만들어 등록된 Route가 있는지 확인하는 방법으로 구현했습니다.

```ts
console.time("test");
const caseOfRoute: Array<Route> = this.createCaseOfRoute(pathList);
console.timeEnd("test");

    private createCaseOfRoute(pathList: Array<string>): Route[] {
        const caseResult: Route[] = [];

        pathList.forEach((_, index) => {
            const tempPathList = [...pathList];
            let tempParameters: Array<string> = [];
            for (let idx = index; idx >= 0; idx--) {
                tempPathList[idx] = ":";
                tempParameters.push(pathList[idx]);

                const parameters = [...tempParameters];
                const path = "/" + tempPathList.join("/");
                caseResult.push({ path, parameters });
            }
            tempParameters = [];
        });
        caseResult.push({ path: "/" + pathList.join("/"), parameters: [] });

        const sortedCaseResult = this.sortCaseOfRoutes(caseResult);
        return sortedCaseResult;
    }
```

테스트를 위해 경로를 많이 생성해 HTTP 요청을 발생시켜봤고,

```bash
curl localhost:3000/a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t/u/v/w/x/y/z
```

무려 한 번의 요청에 5.104ms 소요되는 결과를 받을 수 있었습니다.

```console
test: 5.104ms
```

해당 로직에 대한 문제점이 2가지가 있었는데

1. 다른 개발자가 봤을 때 다소 복잡한 로직으로 인해 어떤 기능을 수행하는 함수인지 빠르게 파악하는게 어려움
2. 모든 경우의 수를 만들다 보니 경로가 많아질 때 시간이 많이 소요됨

이 문제점을 가지고, 개선을 하기 위해 정규식으로 동적 경로를 매칭하고자 했습니다.

우선 라우터에 등록하는 함수를 수정해야 나머지 로직을 구상하기 쉬울 것 같아 등록 함수를 먼저 수정해줬습니다.

```ts
//Router.ts
//기존 로직

get(path: string, func: Function) {
	const pathList = this.separatePath(path);
	const convertedPath = this.convertToDynamicPath(pathList);
	this.route.GET[convertedPath] = func;
}

private convertToDynamicPath(pathList) {
	const transPathList = pathList.map((path) => path[0] === ":" ? path[0] : path);
	const dynamicPath = "/" + transPathList.join("/");
	return dynamicPath;
}
```

기존 로직은 Path를 등록했을 때 path를 각각의 경로로 분해해서 만약 동적 경로 표시인 `:`가 포함된 경우 해당 경로를 `:`만 남긴채 등록했고,

실제로 요청이 들어올 때는 Path를 다시 분리해서 각각의 경로를 `:`로 바꿔서 등록한 Path가 있는지 찾는 방식이었습니다.

새롭게 바뀐 로직은 동적 경로가 포함된 경우 해당 동적 경로의 변수를 정규 표현식 `([^/]+)` 로 바꾸고, 해당 변수 이름을 배열 `dynamicPathName`에 저장해 함께 저장하는 방식으로 구현했습니다.

```ts
//Router.ts
//변경 로직

get(path: string, func: Function) {
	const pathList = this.separatePath(path);
	const [convertedPath, dynamicPathName] = this.convertToDynamicPathIfExist(pathList);
	this.route.GET[convertedPath] = {
		pathName: dynamicPathName,
		callback: func
	};
}

private convertToDynamicPathIfExist(pathList): [string, Array<string>] {
	const dynamicPathDelimiter = ":";
	const dynamicPathName: Array<string> = [];
	const transPathList = pathList.map((path) => {
		if (path.startsWith(dynamicPathDelimiter)) {
			const thisPathName = path.replace(dynamicPathDelimiter, "");
			dynamicPathName.push(thisPathName);
			 return "([^/]+)";
		} else {
			return path;
		}
	});
	const dynamicPath = "/" + transPathList.join("/");
	return [dynamicPath, dynamicPathName];
}
```

등록 방식이 새롭게 바뀌어 경우의 수를 생성하던 기존 함수는 제거했고,

Request로 Route를 판단하던 `requestHandler` 함수도 함께 변경되었습니다.

```ts
//Router.ts

//기존
    requestHandler(req): Response {
        const separatedURL = this.separateURL(req.path);
        const [routePath, queryString] = [separatedURL.path, separatedURL.queryString];
        const pathList = this.separatePath(routePath);
        const caseOfRoute: Array<Route> = this.createCaseOfRoute(pathList);

        for (let idx = 0; idx < caseOfRoute.length; idx++) {
            const exist = this.checkRouteExist(req.method, caseOfRoute[idx].path);
            if (exist) {
                req.params = caseOfRoute[idx].parameters;
                req.query = this.parseQueryString(queryString);
                return this.route[req.method][caseOfRoute[idx].path](req);
            }
        }

        return new Response(404, req.headers.Connection);
    }

////////////////////////////////////////////////////////////////

//변경
    requestHandler(req): Response {
        const separatedURL = this.separateURL(req.path);
        const [routePath, queryString] = [separatedURL.path, separatedURL.queryString];
        const isStaticRouteExist = this.checkRouteExist(req.method, routePath)
        req.query = this.parseQueryString(queryString);

        if (isStaticRouteExist) {
            return this.route[req.method][routePath].callback(req);
        } else {
            return this.routeDynamicPath(req, routePath);
        }
    }
```

개선한 코드에선 Request가 발생했을 때 우선 요청이 발생한 Path로 등록된 Route에 존재하는지 한 번 검사하고,

만약 존재하지 않는다면 등록된 Route를 불러와 매칭할 수 있는 동적 경로가 등록되어 있는지 검사하는 로직을 수행합니다.

동적 경로가 등록되어 있는지 검사하는 로직에서 만약 존재하지 않는다면 404 Response를 반환하도록 구현했습니다.

```ts
//Router.ts
    private routeDynamicPath(req, path) {
        const notExist = -1;
        const allRoutes = Object.keys(this.route[req.method]);
        const matchRouteIdx = allRoutes.findIndex((thisRoute) => {
            const checkMatch = path.match(thisRoute) ?? [];
            if (checkMatch[0] === path) {
                const dynamicPathNames = this.route[req.method][thisRoute].pathName;
                const dynamicPathValues = checkMatch.slice(1);
                dynamicPathNames.forEach((key, idx) => {
                    req.params[key] = dynamicPathValues[idx];
                });
                return true;
            }
        });

        if (matchRouteIdx === notExist) {
            return new Response(404, req.headers.Connection);
        } else {
            const matchedRoute = allRoutes[matchRouteIdx]
            return this.route[req.method][matchedRoute].callback(req);
        }
    }
```

### 동적 경로 처리 개선 결과

개선한 코드에선 모든 경우의 수를 만들 필요가 없었기 때문에 요청으로 들어온 경로의 수가 많았을 때 특히 더욱 체감된 결과를 얻을 수 있었습니다.

기존 동일한 요청에 대해 5.104ms의 소요시간이 걸렸던 것에 비해 결과는 아래와 같습니다.

```bash
curl localhost:3000/a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t/u/v/w/x/y/z
```

```console
test: 0.166ms
```


### 기존 Router 내 함수 분리

기존에 Router에서 함께 관리하던 url 관련 파싱 함수들을 Router 클래스의 복잡도를 낮추기 위해 분리해서 상속했습니다.

```ts
// Url.ts
class Url {
    separateURL(url) {
        const [prePath, anchor] = url.split("#");
        const [path, queryString] = prePath.split("?");
        return {
            path: path,
            queryString: queryString || null,
            anchor: anchor || null
        };
    }

    separatePath(path): Array<string> {
        const [empty, ...pathList] = path.split("/");
        return pathList;
    }

    parseQueryString(queryString) {
        if (!queryString)
            return null;
        const result = {};
        const queries = queryString.split("&");
        queries.forEach((query) => {
            const [key, value] = query.split("=");
            result[key] = value;
        });
        
        return result;
    }
}

//Router.ts
class Router extends Url {
    constructor() { super() }
	...
```


### 디렉토리 일부 구조 변경

```
📦dto  
 ┣ 📜Request.ts  
 ┗ 📜Response.ts

📦route  
 ┣ 📜Router.ts  
 ┣ 📜RouteStack.ts  
 ┣ 📜staticRouter.ts  
 ┣ 📜Url.ts  
 ┗ 📜userRouter.ts
```

현재는 전 범위에서 사용되는 Router, Request, Response 등이 각 디렉토리에 일부로 편입되어있는 상태입니다.

이에 대한 책임을 옮기고자 core 디렉토리를 만들어 다양한 범위에서 사용되는 기능 및 모델을 분리하도록 하겠습니다.

```
📦core  
 ┣ 📂http  
 ┃ ┣ 📜Request.ts  
 ┃ ┗ 📜Response.ts  
 ┣ 📂router  
 ┃ ┣ 📜Router.ts  
 ┃ ┗ 📜RouteStack.ts  
 ┗ 📂url  
 ┃ ┗ 📜Url.ts
```

### Response 객체 생성 위치 변경

기존에는 라우터에 Request만 전달해 만들어지는 결과에 따라 Response 객체를 생성해 반환하도록 구현했는데 Response 객체를 처음에 생성하고 넘기는 방식으로 변경하려고 합니다.

기존에 Response 객체를 만들고 반환하도록 구현했던 이유는 socket을 여는 계층과, write하는 계층, end하는 계층이 모두 동일해야 한다고 생각했기 때문인데,

```ts
//Response.ts 기존
class Response {
    responseMsg: string;

    constructor(statusCode, connection, ext: string | null = null, body: string | null = null) {
        this.setStatusLine(statusCode);
        this.setHeaders(connection, ext, body);
        this.setBody(body);
    }

    private setStatusLine(statusCode) {
        const startLine = `HTTP/1.1 ${statusCode} ${statusMsg[statusCode]}\r\n`;
        this.responseMsg = startLine;
    }

    private setHeaders(connection, ext, body) {
        this.responseMsg += `Server: Jinyoung\r\n`;
        this.responseMsg += `Date: ${new Date().toString()}\r\n`;
        if (body) {
            this.responseMsg += `Content-Type: ${contentType[ext]}; charset=UTF-8\r\n`;
            this.responseMsg += `Content-Length: ${Buffer.byteLength(body, 'utf-8')}\r\n`;
        }
        this.responseMsg += `Connection: ${connection}\r\n`;
        if (connection === 'Keep-Alive') {
            this.responseMsg += `Keep-Alive: timeout=5, max=1000\r\n`;
        }
        this.responseMsg += '\r\n';
    }

    private setBody(body) {
        this.responseMsg += body ?? "";
    }
}
```

변경하려는 이유는 이미지 등 바이너리 파일을 전달할 때 파일을 읽는 위치와 Response Message를 작성하는 위치가 다르기 때문에 현재처럼 Message를 완성해서 전달할 때 구현하기 힘들다는 점,

지금 모습에선 header와 body를 구분해서 Message를 작성하기 힘들다는 점이 문제라고 생각해 변경하려고 계획 했습니다.

```ts
//Response.ts 변경 후
class Response {
    private socket: net.Socket;
    private statusCode: number = 0;
    private cookie: string;
    connection: string;

    constructor(socket, connection) {
        this.socket = socket;
        this.connection = connection ?? "close";
    }

    send() {
        if (!this.statusCode) throw new Error("Status code has not been set yet.");
        const startLine = `HTTP/1.1 ${this.statusCode} ${statusMsg[this.statusCode]}\r\n`;
        let header = this.setInitialHeaderOption();

        this.socket.write(startLine);
        this.socket.write(header);
        this.socket.write(emptyLine);
    }

    sendFile(filePath) {
        if (!this.statusCode) throw new Error("Status code has not been set yet.");
        if (!fs.existsSync(filePath)) throw new Error("File does not exist");
        const ext = path.extname(filePath);
        const file = fs.readFileSync(filePath);
        const startLine = `HTTP/1.1 ${this.statusCode} ${statusMsg[this.statusCode]}\r\n`;
        let header = this.setInitialHeaderOption();
        header += `Content-Type: ${contentType[ext]}; charset=UTF-8\r\n`;
        header += `Content-Length: ${Buffer.byteLength(file)}\r\n`;

        this.socket.write(startLine);
        this.socket.write(header);
        this.socket.write(emptyLine);
        this.socket.write(file);
    }

    json(data: object) {
        if (!this.statusCode) throw new Error("Status code has not been set yet.");
        const startLine = `HTTP/1.1 ${this.statusCode} ${statusMsg[this.statusCode]}\r\n`;
        const body = JSON.stringify(data);
        let header = this.setInitialHeaderOption();
        header += `Content-Type: application/json; charset=UTF-8\r\n`;
        header += `Content-Length: ${Buffer.byteLength(body, 'utf-8')}\r\n`;

        this.socket.write(startLine);
        this.socket.write(header);
        this.socket.write(emptyLine);
        this.socket.write(body);
    }

    setStatus(statusCode) {
        const message = statusMsg[statusCode];
        if (message) {
            this.statusCode = statusCode;
        } else {
            throw new Error("This status code does not exist")
        }

        return this;
    }

    setCookie(key: string, value, option: cookieOption | null) {
        this.cookie = `${key}=${value};` + ` ${JSON.stringify(option)}`;
        return this;
    }

    private setInitialHeaderOption() {
        let header = "";
        header += `Server: Jinyoung\r\n`;
        header += `Date: ${new Date().toString()}\r\n`;
        header += `Connection: ${this.connection}\r\n`;
        if (this.connection === 'Keep-Alive') {
            header += `Keep-Alive: timeout=5, max=1000\r\n`;
        }
        return header;
    }
}
```


```ts
//기존 Response를 사용하던 모습
const response = new Response(400, req.headers.Connection ?? "close");
return response;

socket.write(response.responseMsg);

//////////////////////////

//변경 후
res
  .setStatus(400)
  .send();
```

</div>
</details>


<details>
<summary>수요일</summary>
<div markdown="1">

### 쿠키 설정

우선 쿠키를 설정해주기 위해서 쿠키에 설정할 수 있는 옵션들에 대한 정의를 해줬습니다.

```ts
//Cookie.ts
type cookieSameSiteOption = "Strict" | "Lax" | "None";

type cookieOption = {
    Domain?: string;
    Expires?: Date;
    HttpOnly?: boolean;
    "Max-Age"?: number;
    Path?: string;
    Secure?: boolean;
    SameSite?: cookieSameSiteOption;
    Partitioned?: boolean;
}
```

이후에 Response의 setCookie 메서드를 통해 쿠키를 설정한 경우 HTTP Response header를 생성할 때 Set-Cookie 속성도 함께 보내질 수 있도록 만들었습니다.

```ts
//Response.ts
    setCookie(key: string, value, option?: cookieOption) {
        this.cookie = `${key}=${value}`;
        if (option) Object.keys(option).forEach((opt) => {
            if (typeof option[opt] !== 'boolean') {
                this.cookie += `; ${opt}=${option[opt]}`;
            } else if (option[opt]) {
                this.cookie += `; ${opt}`;
            }
        });
        return this;
    }
```


### 잘못된 HTTP Response Message

HTTP Response Message를 완성해서 보내는 것에서 개별적으로 보내는 것으로 방식을 바꾼 이후부터 

Failed to load resource: net::ERR_INVALID_HTTP_RESPONSE

에러를 받을 수 있었습니다. HTTP Response Message가 잘못되었다는 뜻이었는데,

이전에는 발생하지 않다가 Response 를 리팩토링 하는 과정에서 발생한 문제라고 판단할 수 있었습니다.

```ts
	this.socket.write(startLine);
	this.socket.write(header);
	this.socket.write(emptyLine);
	this.socket.write(body);
```

현재는 위 처럼 HTTP Response Message를 보내고 있었는데, 

문제의 원인은 emptyLine에 있었습니다.

HTTP에서 header와 body의 구분은 빈 문자열인 empty line으로 판단하는데, 제가 이 empty line을 정의하는 부분에서 `\r\n`으로 처리했기 때문에 발생한 문제였고, 해당 부분을 `\r\n\r\n` 으로 바꿔 해결할 수 있었습니다.

```ts
//해결 전
const emptyLine = "\r\n";

//해결 후
const emptyLine = "\r\n\r\n";
```


### DB 접근 및 비즈니스 로직 처리 계층 분리

기존에는 빠르게 기능 구현을 확인하기 위해서 라우팅 과정에서 호출하는 controller 함수에 DB로 접근해 데이터를 가져오는 기능을 포함시켰습니다.

이제는 확장성과 계층 별 책임과 역할 분리를 목적으로 Repository라는 데이터 접근 계층을 만들고, Controller 계층에선 비즈니스 로직만 처리하도록 분리하려고 합니다.

```ts
//UserRepository.ts
class UserRepository {
    static tableName = "users";

    static async getUser(email) {
        return await db1004.select({
            table: this.tableName,
            column: "*",
            condition: `email="${email}"`
        });
    }

    static async createUser(email, password, name) {
        return await db1004.insert({
            table: this.tableName,
            columns: ["email", "password", "name"],
            values: [email, password, name]
        });
    }
}
```

```ts
//signUpController.ts
function signUpController(req, res) {
    const userData: signUpInfo = req.body as signUpInfo;
    const [email, password, name] = [userData.email, md5Encryption(userData.password), userData.name];

    try {
        UserRepository.getUser(email).then((response) => {
            const result = response[0][0];
            const emailAvailable = result == null;
            if (emailAvailable) {
                UserRepository.createUser(email, password, name);

                res
                    .setStatus(302)
                    .send();
            }
        });
    } catch (e) {
        res
            .setStatus(400)
            .send();
    }
}
```

### HTTP Request Cookie Parsing

쿠키를 설정하고 이후에 쿠키가 Request로 오기 시작하면서 Cookie가 있는 경우 이용하기 쉽도록 object로 파싱하는 과정이 필요하다고 느꼈습니다.

```ts
//Request.ts
    private parseHeader(headerMsg) {
	...중략
        if (this.headers.Cookie != null) cookieParser(this.headers);
    }

//Cookie.ts
function cookieParser(header) {
    const cookieString = header.Cookie;
    const cookies = cookieString.split(";");
    const cookieObject = cookies.reduce((obj, thisCookie) => {
        const [key, value] = thisCookie.trim().split("=");
        obj[key] = value;
        return obj;
    }, {});
    header.Cookie = cookieObject;
}
```


### HTTP Request Content 검사

서버에서 HTTP Request Message의 위변조를 검사하기 위해서 body가 존재할 경우에 Content-length와 body의 크기를 비교하는 로직을 작성했습니다.

```ts
//Request.ts
    private parseBody(bodyMsg) {
        const bodyMsgExist = bodyMsg !== "";
		
		...중략
		
        if (bodyMsgExist) {
            const checkContentLength = this.headers["Content-Length"] === Buffer.byteLength(bodyMsg).toString();
            if (!checkContentLength) this.error = "Invalid Content-Length";
        }
    }
```


로직은 body를 parsing해서 저장할 때 검사하도록 했고,
만약 일치하지 않는다면 this.error을 해당 에러로 설정해 app.ts에서 로직을 수행하기 전 검사하도록 작성했습니다.

```ts
//app.ts
const server = net.createServer(socket => {
    socket.on("data", (data) => {
        const socketData = data.toString();
        const req = new Request(socketData);
        const res = new Response(socket, req.headers.Connection);

        if (req.error != null) res.setStatus(400).send(req.error);
        else try {
        ...중략
```

### 회원가입 정보 유효성 검사

만약 회원가입 시 비정상적인 규격 혹은 공백의 문자열이 들어왔을 경우 이를 검사하는 로직을 추가했습니다.

```ts
//signUpController.ts
    const emailRegexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$"
    const isEmailStandard = email.match(emailRegexp) != null;
    const isPasswordStandard = password.trim() !== "";
    const isNameStandard = name.trim() !== "";

    if (!isEmailStandard || !isPasswordStandard || !isNameStandard) res.setStatus(400).send();
```


### 세션 구현

세션을 어떻게 구현할지 고민을 했는데 당장은 굳이 어렵게 혹은 복잡하게 구현할 필요가 없다고 생각해 간단히 Session 클래스를 만들어 외부에서 사용할 수 있도록 만들었습니다.

```ts
//Session.ts
class Session {
    private storage = {};

    set(sid, data) {
        this.storage[sid] = data;
    }

    get(sid) {
        return this.storage[sid];
    }

    isExist(sid) {
        return this.storage[sid] != null;
    }
}
```

그리고, 구현된 Session을 활용해 로그인에 성공 시 Session에 user id를 저장하도록 구현했습니다.

```ts
//signInController.ts
if (password === result.password) {
	const sid = sha1Encryption(email + Date.now().toString());
	session.set(sid, result.id);
	...중략
```

</div>
</details>


<details>
<summary>목요일</summary>
<div markdown="1">

### 멘토님 리뷰 사항 개선

우선 리뷰 요청에 대한 개선을 수행하고자 했고,
단 저만의 규칙으로 멘토님이 제안해주셨다고 다 변경하는 것이 아닌, 하나의 의견으로 받아들이고 제가 생각할 때도 합당하고 바꾸면 좋겠다 싶은 내용들만 개선하기로 했습니다.

#### DB 관련

```ts
//#query 메서드가 수행하려는 메시지가 무엇인지 궁금해요.
//executeQuery라는 메서드명은 어떨까요? 기존 connectionPool에서 사용하는 메서드와 헷갈릴 수 있을 거 같아요.

    async #query(query, values = null) {
        const connection = await this.connectionPool.getConnection();
        const result = connection.query(query, values);
        connection.release();
        return result;
    }
```

mysql connection의 기존 메서드인 .query와 헷갈릴 수 있을 것 같다는 의견은 생각해보지 못한 접근이었습니다.

확실히 그렇게 생각해보니 connection의 query 메서드와는 다르게 connection을 연결하고 해제하는 로직이 추가돼 구분이 되면 좋겠다고 생각하게 되었고,

제안해주신 대로 executeQuery가 의미있는 것 같아 해당 내용처럼 변경했습니다.

```ts
//개선 후
private async executeQuery(query, values?) {
	...
}
```


#### 쿠키 관련

```ts
//작성한 함수명이 cookieParser기 때문에 cookie 객체만 반환하고, header에 추가하는 함수를 별도로 작성해도 좋을 거 같아요.
function cookieParser(header) {
    const cookieString = header.cookie;
    const cookies = cookieString.split(";");
    const cookieObject = cookies.reduce((obj, thisCookie) => {
        const [key, value] = thisCookie.trim().split("=");
        obj[key] = value;
        return obj;
    }, {});
    header.cookie = cookieObject;
}
```

의견을 주신 것에 적극 동감했습니다.

이름이 cookieParser인데 현재는 헤더를 인자로 받아 쿠키를 파싱한 형태로 저장하는 역할을 수행하고 있기 때문에

의견을 주신대로 역할을 분리하는 것이 맞다고 생각했고 아래처럼 개선했습니다.

```ts
//개선 후
function cookieParser(cookieString) {
    const cookies = cookieString.split(";");
    const cookieObject = cookies.reduce((obj, thisCookie) => {
        const [key, value] = thisCookie.trim().split("=");
        obj[key] = value;
        return obj;
    }, {});

    return cookieObject;
}

//Request.ts
if (this.headers.cookie != null) {
	const cookieObject = cookieParser(this.headers.cookie);
	this.headers.cookie = cookieObject;
}
```


#### 이외 로직 관련

```ts
//파이썬스러운(?) 문법처럼 보여요. 객체 디스트력쳐링을 활용하는건 어떨까요~?

function signUpController(req, res) {
	const [email, password, name] = [userData.email, md5(Encryption(userData.password), userData.name)];
...
```

파이썬을 사용해본 적이 없어서 어떤 느낌으로 받아들이시는지는 잘 모르겠지만,  말씀하신 것 처럼 객체 디스트럭처링을 쓰면 조금 더 깔끔해지는 것 같다고 느껴 변경하게 되었습니다.

```ts
//개선 후
function signUpController(req, res) {
    const { email, password, name } = userData;
    const encryptionPW = md5Encryption(password);
...
```


추가로 고민과 해결 과정에서 라우팅에 관한 개선 내용이 있었고, 개선한 부분에 대해 어떻게 생각하시는 여쭤봤을 때 인상적인 방법에 대해 추가로 알 수 있어서 이후에 더 개선하면 좋겠다고 생각했습니다.

```
HTTP Request 라우팅 관련 로직

정규식을 사용하여 동적 경로를 처리하고 있는데요. `findIndex`로 모든 경로에 대해 정규식 매칭을 반복하고 있어 경우의 수가 많아지면 성능 저하에 영향을 미칠 수 있습니다. 이 때는 트리구조를 고민해보셔도 좋을 거 같습니다. 성능에 문제가 없는 수준이라면 우선 다른 요구사항 구현에 리소스를 쏟는 게 좋을 거 같긴 합니다.
```

### 로그인 과정 sid 검증

```ts
    if (session.isExist(sid)) res.setStatus(200).send(session.get(sid));

    else try {
    ...중략
```

### 유효하지 않은 SID일 시 쿠키초기화

매 요청이 들어오면 유효한 sid인지 검사합니다.
만약 유효하지 않은 sid일 경우에 sid를 초기화해주는 로직을 작성했습니다.

```ts
//app.ts
function ifSidNotValidCookieInit(req, res) {
    const sid = req.headers.cookie != null ? req.headers.cookie.sid : "none";
    const ifSidNotValid = sid !== "none" && !session.isExist(sid);
    if (ifSidNotValid) {
        res.setCookie("sid", "Remove cookie", { HttpOnly: true, Path: "/", "Max-Age": 0 });
    }
}
```

### Jest 및 관련 패키지 설치, 설정

https://kulshekhar.github.io/ts-jest/docs/getting-started/installation/#jest-config-file

typescript와 jest를 함께 사용하기 위해 패키지 설치와 함께 설정해야 할 것들이 있었습니다.

```console
//jest 설치
npm install --save-dev jest typescript ts-jest @types/jest
```

패키지를 설치한 이후 기본 설정 파일을 만들어줬습니다.

```console
npx ts-jest config:init
```

이후 생긴 jest.config.js 파일에 `preset: "ts-jest`를 추가해줍니다.

```js
//jest.config.js
/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+.ts?$": ["ts-jest", {}],
  },
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/**/*.test.ts"],
};
```

 빠르게 테스트를 시작할 수 있도록 package.json의 script에도 test를 추가해줍니다.

```json
//package.json
  "scripts": {
  //..중략
    "test": "jest"
  },
```

이후 정상적으로 jest가 실행되는지 확인하기 위해 임시 테스트를 실행했는데
테스트는 실행되었지만, 아래와 같이 경고 문구를 받게 되었습니다.

```console
ts-jest[config] (WARN) message TS151001: 
If you have issues related to imports, you should consider setting `esModuleInterop` to `true` in your TypeScript configuration file (usually `tsconfig.json`). See 
https://blogs.msdn.microsoft.com/typescript/2018/01/31/announcing-typescript-2-7/#easier-ecmascript-module-interoperability for more information.
```

ts를 사용할 때 import 관련 에러를 겪을 수 있으니 연관 돼 있다면 tsconfig 파일에 `esModuleInterop` 옵션을 true로 설정하라는 의미였습니다.

아직 정상 동작 확인 단계였지만 이후에는 import를 사용할 예정이기 때문에 미리 tsconfig 파일을 생성해서 설정해주도록 하겠습니다.

https://inpa.tistory.com/entry/TS-%F0%9F%93%98-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-tsconfigjson-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0-%EC%B4%9D%EC%A0%95%EB%A6%AC


```json
{
    "compilerOptions": {
        "target": "es6",
        "module": "commonjs",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
    },
    "include": [
        "**/*.test.ts"
    ]
}
```

### 테스트 코드 작성하기

..어떻게 해야 하지? ㅠㅠ 어떻게 작성하면 좋을지 감이 안잡힙니다.


</div>
</details>


</div>
</details>


<details>
<summary>3주차</summary>
<div markdown="1">

# 🔥 나만의 주간 계획서 (3)

## ✅ 나만의 체크포인트 ⭕❌

⭕ 리액트에서 바닐라로 FE 사양 변경 
	⭕ 리액트에서 구현한 컴포넌트를 템플릿 리터럴 방식으로 변환
	⭕ 전체 페이지를 리액트에서 바닐라로 변환
	⭕ 웹 프론트 이벤트 및 기능 Script로 변환

⭕ 토큰 발급 설계 및 구현

⭕ 웹 프론트 구현
	⭕ 메인 페이지 구현
	⭕ 로그인 상태일 경우 메인 페이지에 사용자 이름을 표시
	⭕ 로그인 상태가 아닐 경우 로그인 버튼 표시

⭕ 로그아웃 구현
	⭕ 로그아웃 요청 시 토큰 삭제 로직 추가

❌ 동적인 HTML 응답 구현
	❌ 사용자가 로그인 상태일 경우 [http://localhost:8080/user/list](http://localhost:8080/user/list) 에서 사용자 목록을 출력
	⭕ 인증방식을 쿠키가 아닌 토큰을 사용하도록 변경 (필요에 따라 토큰과 세션 병행)
		- 토큰은 무작위 문자열로 구성하고 디코딩 가능한 정보를 담지 않는다.

⭕ 게시판 기능을 포함한 ERD 다시 그리기

❌ 게시판 기능 완성
	❌ 메인 하단에 글쓰기 버튼 추가
		- 글쓰기 버튼 시 write.html로 이동
		- 만약 비로그인 유저라면 로그인 페이지로 이동
	❌ write.html에서는 글을 입력할 수 있도록
	❌ 로그인한 사용자가 글 제목 클릭시 세부 내용을 볼 수 있는 페이지로 이동
		- 만약 비로그인 유저라면 로그인 페이지로 이동
	❌ 404 및 기타 에러 처리 페이지 구현

❌ 테스트 코드 작성
	❌ Jest 세부 기능 학습
	❌ HTTP Message에 대한 테스트 코드 작성
	❌ 비즈니스 로직에 대한 테스트 코드 작성

## 📝 학습 및 구현 계획

### 월요일

- 리액트에서 바닐라로 FE 사양 변경 
	- 리액트에서 구현한 컴포넌트를 템플릿 리터럴 방식으로 변환
	- 전체 페이지를 리액트에서 바닐라로 변환
	- 웹 프론트 이벤트 및 기능 Script로 변환

### 화요일

- 웹 프론트 구현
	- 메인 페이지 구현
	- 로그인 상태일 경우 메인 페이지에 사용자 이름을 표시
	- 로그인 상태가 아닐 경우 로그인 버튼 표시

- 로그아웃 구현
	- 로그아웃 요청 시 세션 및 토큰 삭제 로직 추가

### 수요일

- 동적인 HTML 응답 구현
	- 사용자가 로그인 상태일 경우 [http://localhost:8080/user/list](http://localhost:8080/user/list) 에서 사용자 목록을 출력
	- 인증방식을 쿠키가 아닌 토큰을 사용하도록 변경 (필요에 따라 토큰과 세션 병행)
		- 토큰은 무작위 문자열로 구성하고 디코딩 가능한 정보를 담지 않는다.

### 목요일

- 게시판 기능을 포함한 ERD 다시 그리기

- 게시판 기능 완성
	- 메인 하단에 글쓰기 버튼 추가
		- 글쓰기 버튼 시 write.html로 이동
		- 만약 비로그인 유저라면 로그인 페이지로 이동
	- write.html에서는 글을 입력할 수 있도록
	- 로그인한 사용자가 글 제목 클릭시 세부 내용을 볼 수 있는 페이지로 이동
		- 만약 비로그인 유저라면 로그인 페이지로 이동
	- 404 및 기타 에러 처리 페이지 구현


## ✏️ 고민과 해결 과정 쌓아가기

<details>
<summary>월요일</summary>
<div markdown="1">

### 리액트에서 바닐라로 마이그레이션 하기

첫 주차에 웹 프론트를 리액트로 개발했었는데, 리액트 사용은 권장하지 않는다고 해서 새로운 웹 페이지 구현에 앞서 웹 프론트를 바닐라로 마이그레이션 하는 작업이 필요했습니다.

```
//마이그레이션 이전
📦FE  
 ┣ 📂src  
 ┃ ┣ 📂components  
 ┃ ┃ ┣ 📜Button.tsx  
 ┃ ┃ ┣ 📜Frame.tsx  
 ┃ ┃ ┗ 📜InputBox.tsx  
 ┃ ┣ 📂layouts  
 ┃ ┃ ┣ 📜Login.tsx  
 ┃ ┃ ┗ 📜Register.tsx  
 ┃ ┣ 📂stylesheets  
 ┃ ┃ ┣ 📜Button.css  
 ┃ ┃ ┣ 📜foundation.css  
 ┃ ┃ ┣ 📜Frame.css  
 ┃ ┃ ┣ 📜index.css  
 ┃ ┃ ┗ 📜InputBox.css  
 ┃ ┣ 📜main.tsx  
 ┃ ┗ 📜vite-env.d.ts  
 ┣ 📜.env  
 ┣ 📜.gitignore  
 ┣ 📜eslint.config.js  
 ┣ 📜index.html  
 ┣ 📜package-lock.json  
 ┣ 📜package.json  
 ┣ 📜tsconfig.app.json  
 ┣ 📜tsconfig.json  
 ┣ 📜tsconfig.node.json  
 ┗ 📜vite.config.ts

📦static  
 ┣ 📂assets  
 ┃ ┣ 📜index-5axTRczP.css  
 ┃ ┗ 📜index-BYA0q6UV.js  
 ┣ 📜favicon.ico  
 ┗ 📜index.html
```

tsx 파일을 마이그레이션함과 함께 FE 디렉토리에서 정적 파일들을 분리해 `static` 디렉토리에 포함시켜줬습니다.

```
//마이그레이션 이후
📦static  
 ┣ 📂components  
 ┃ ┣ 📜Button.ts  
 ┃ ┣ 📜Frame.ts  
 ┃ ┗ 📜InputBox.ts  
 ┣ 📂layouts  
 ┃ ┣ 📜loginLayout.ts  
 ┃ ┣ 📜mainLayout.ts  
 ┃ ┗ 📜registerLayout.ts  
 ┣ 📂stylesheets  
 ┃ ┣ 📜Button.css  
 ┃ ┣ 📜foundation.css  
 ┃ ┣ 📜Frame.css  
 ┃ ┣ 📜index.css  
 ┃ ┗ 📜InputBox.css  
 ┣ 📜favicon.ico  
 ┗ 📜index.html
```


### .ts 확장자 MIME 타입 에러

리액트로 개발했던 .tsx 파일을 .ts 파일로 바꾸고 서버에서 파일을 송신했는데

```
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "undefined". Strict MIME type checking is enforced for module scripts per HTML spec.
```

.ts 확장자에 대한 Contnet-Type 처리를 안해줘서 발생했던 문제였기 때문에 .ts 확장자에 대한 Content-Type 응답을 추가해줬습니다.

다만 이후에 .ts 파일을 그대로 보내니 웹 브라우저에서 ts를 인식하지 못하는 문제를 마주했습니다.

저에겐 두 가지 선택지가 있었는데

1. .ts 파일을 .js 파일로 바꾼다.
2. .ts 파일을 .js 파일로 컴파일 해서 보내주기

굳이 ts가 필요한 상황은 아니었기 때문에 .js 파일로 바꾸기로 결정 했습니다.


### Response Content-Length에 관한 문제


```
//서버에서 보내는 경우
export { SmallButton, LargeButton }

//브라우저에서 받는 경우
export { SmallButton, LargeButton
```

파일이 정해진 만큼 수신 되지 않는다는 것에 대해 원인을 파악하기 위해 Content-Length를 파일 크기에 임의의 수를 더해 읽히는지 확인해봤는데

Content-Length를 올리면 정상적으로 읽히는 것을 확인할 수 있었습니다.

파일의 크기는 정상적인데 왜 Content-Length를 올려야 정상적으로 파일을 끝까지 읽을까?에 대해 생각해봤습니다.

합리적인 추론으로 HTTP Message의 Body로 보내는 메시지에 무언가 데이터가 추가되어 들어간다고 판단할 수 있었고, file은 Buffer의 형태로 전달하기 때문에 header와 body를 구분하는 empty line이 문제일 수 있겠다고 생각했습니다.

```ts
//문제가 된 부분
const emptyLine = "\r\n\r\n";
```

근데 이 부분은 사실 지난 주 HTTP Response Message 문제와 반대되는 문제인데 오히려 지난 주에는 `\r\n`으로 보냈을 때 `Failed to load resource: net::ERR_INVALID_HTTP_RESPONSE` 에러를 만났기 때문입니다.

즉 `send()` 를 보낼 땐 emptyLine이 추가가 되어야 된다는 의미였고, send 함수 외에는 body가 항상 포함되는 함수기 때문에 body가 비어있을 때 `\r\n`을 포함하도록 바꾸어 해결했습니다.

```ts
private socketWrite(header, body = "\r\n") {
        if (!this.statusCode) throw new Error("Status code has not been set yet.");
        const startLine = `HTTP/1.1 ${this.statusCode} ${statusMsg[this.statusCode]}\r\n`;
        const emptyLine = "\r\n";

        this.socket.write(startLine);
        this.socket.write(header);
        this.socket.write(emptyLine);
        if (body) this.socket.write(body);
    }
}
```

</div>
</details>


<details>
<summary>화요일</summary>
<div markdown="1">


### 로그인 시 redirect에 대한 고민

```ts
res.redirect("/");

res.setStatus(200).send("/");
```

클라이언트에서 로그인을 시도하고, 서버에서는 로그인에 성공 시 클라이언트를 메인 페이지로 보내주도록 구현해야 했었는데,

제가 선택 가능한, 서버에서 보내줄 수 있는 응답이 2종류가 있었습니다.

1. status code를 302로 설정하고, HTTP Response Message Header에 Location으로 url을 설정해서 전달하는 방식,

2. status code를 200으로 설정하고 plain/text로 redirect될 url을 내용으로 전달하는 방식

만약 1번 방식을 사용하여 응답을 할 경우 브라우저에서 응답을 받았을 때 즉시 리다이렉트를 해  메인페이지에 대한 html을 받아오지만

현재 Ajax 방식으로 요청을 보내기 때문에 DOM 파싱을 수동으로 해줘야 한다는 문제가 있었고,

2번 방식을 사용할 경우 window.location.href를 이용해 수동 리다이렉트를 해줄 수 있고 DOM 파싱이 알아서 되지만,

리다이렉션을 유도하지만 응답 코드가 200이라서 개인적으로 찜찜한 기분이 든다는 것이 문제였습니다.

```ts
//signinController.ts
res.setStatus(200).json({ redirect: "/" });

//loginLayout.js
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
```

결과적으로 서버는 로그인 성공 시 status code를 200으로 설정하고 body로 리다이렉트할 url을 보내면,

클라이언트는 응답받은 status code에 따라 리다이렉트를 할지, 로그인 에러 처리를 응답할지 결정하도록 했습니다.


### 토큰 설계 및 구현

이번 주 요구사항에 맞게 기존 쿠키-세션을 이용하던 방식에서 토큰을 사용하는 방식으로 변경을 하고,
필요하다면 세션을 함께 이용하도록 하려고 합니다.

우선 토큰을 자체적으로 제작해야 하기 때문에 어떻게 구현하더라도 상관 없어서 정말 쉽게 구현하려면 쉽게 구현할 수 있겠지만, 

제대로 발급 과정을 설계하고, 응답할 수 있도록 만들려고 합니다.

#### 토큰 구조 설계

우선 토큰을 발급하는 과정을 개발하기 앞서 토큰이 어떤 구조로 이루어지는지 설계해야 했습니다.

토큰의 발급을 Access Token과 Refresh Token 으로 나누어 발급할 예정이긴 하지만, 토큰의 구조는 동일하게 만들 예정입니다.

```
SECRET.BODY.INTEGRITY_TAG
```

우선 토큰 인증 과정에서 해당 토큰에 대한 무결성 검사를 구현하고 싶었습니다.

그렇기 때문에 토큰을 마침표로 구분하는 `시크릿.바디.무결성태그` 구조로 만들고, 시크릿과 바디를 복호화 한 이후 합쳐서 해싱했을 때 무결성 태그가 완성되는지 확인하는 방식으로 구현할 예정입니다.

```
토큰의 구성

1. 시크릿 (서버에서 관리하는 시크릿 키)
2. 바디
	- iat (발행 시간)
	- exp (만료 시간)
	- grd (등급)
	- typ (토큰 타입)
1. 무결성 태그 (시크릿과 바디를 합친 것을 해싱한 값)
```

#### 어떻게 암호화 할 것인가?

토큰의 내용을 암호화 하기 위해서 각 내용을 AES 대칭 암호화 방식을 이용할 예정입니다.

AES 암호화 방식에서도 다양한 방법으로 암호화 할 수 있었는데

```
사용 가능한 알고리즘 (AES-비트-모드)
- AES-128-CBC
- AES-192-CBC
- AES-256-CBC
- AES-128-GCM
- AES-192-GCM
- AES-256-GCM
```

- CBC (Cipher Block Chaining) 모드와 GCM (Galois/Counter Mode) 모드의 차이

```
CBC 모드는 데이터를 블록 단위로 나눠 첫 블록을 IV와 함께 암호화 한 이후 이후 블록을 암호화된 이전 블록과 함께 암호화를 수행

데이터를 블록 단위로 나누기 때문에 데이터의 길이를 블록 크기로 맞추기 위해서 필요한 경우 패딩이 추가될 수 있음
```

```
GCM 모드도 데이터를 블록 단위로 나누지만, IV를 활용해 카운터를 생성하고 블록마다 카운터를 증가시켜 함께 암호화 하는 방식

GCM 모드는 Galois 필드를 사용하여 인증 태그를 생성하고, 계산하여 데이터 무결성을 검증할 수 있음
```

무결성 검사는 토큰 자체로 할 예정이고, 그리 복잡하게 구현할 필요까지는 없다고 생각해 CBC 모드, 그리고 그 중에서도 256bit를 이용한 방식으로 암호화를 하겠습니다.

#### 토큰 발급과 인증 흐름 설계

<img src="https://i.ibb.co/9wG2dYN/Pasted-image-20241008203513.png" alt="token_architecture">

#### 구현

설계를 끝냈으니, 이제 설계한 내용에 맞도록 구현을 할 예정입니다.

우선 토큰의 각 부분을 암호화 하고 복호화 할 수 있는 함수를 만들어야 했습니다.

```ts
//AES 암호화에서 사용할 방식
const alg = 'aes-256-cbc';
//256비트의 랜덤 키
const encryptedKey = crypto.randomBytes(32);
//초기화용 벡터 값
const initializeVector = crypto.randomBytes(16);

//암호화 함수
function encrypt(text) {
    const cipher = crypto.createCipheriv(alg, encryptedKey, initializeVector);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

//복호화 함수
function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(alg, encryptedKey, initializeVector);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

//무결성 검사용 태그 생성 함수
function createIntegrityTag(secret, body) {
    return crypto.createHash("sha256").update(body + secret).digest("hex");
}
```


암호화 및 복호화에 관한 함수를 만들었으니, 이제 암호화 함수를 이용해 토큰을 발급하는 함수를 작성했습니다.

- 토큰 생성 함수

```ts
//Authorization.ts
class Authorization {
    static generateToken(tokenType: TokenType) {
        const iat = new Date();
        const exp = new Date();
        tokenType === "Access"
            ? exp.setMinutes(exp.getMinutes() + 15)
            : exp.setDate(exp.getDate() + 61);
        const grd = gradeType.USER;
        const typ = tokenType;
        const body: TokenBody = { iat, exp, grd, typ };

        const secretOfToken = encrypt(process.env.SECRET);
        const bodyOfToken = encrypt(JSON.stringify(body));
        const integrityTag = createIntegrityTag(process.env.SECRET, JSON.stringify(body));

        const token = `${secretOfToken}.${bodyOfToken}.${integrityTag}`;
        return token;
    }
}
```

Access Token은 15분의 기한을 가지도록 했고, Refresh Token은 61일의 기한을 가지도록 했는데 

Refresh Token을 61일로 설정한 이유는 특별한 이유는 아니었고,
카카오에서 2달로 설정했다는 것을 참고해 설정했습니다.

https://devtalk.kakao.com/t/refresh-token/128850


- 토큰 검증 함수

```ts
//Authorization.ts
class Authorization {
    static verifyToken(token, tokenType: TokenType) {
        const now = new Date();
        const [secretOfToken, bodyOfToken, integrityTag] = accessToken.split(".");
        const secret = decrypt(secretOfToken);
        const bodyJSON = decrypt(bodyOfToken);
        const thisContentIntegrityTag = createIntegrityTag(secret, bodyJSON);
        const body = JSON.parse(bodyJSON) as TokenBody;
        const exp = new Date(body.exp);
  
        if (secret !== process.env.SECRET) return false;
        if (thisContentIntegrityTag !== integrityTag) return false;
        if (body.typ !== tokenType) return false;
        if (exp.getTime() < now.getTime()) throw new Error(`Invalid {tokenType} Token`);
        return true;
    }
}
```

토큰 검증 함수에선 인자로 전달받은 Token을 분해해 유효성을 검증하도록 작성했습니다.

검증 함수에서 수행하는 일은 아래와 같습니다.

1. 토큰 분해
2. secret 검증
3. 토큰의 내용이 무결한지 무결성 태그를 통한 검증
4. typ 검증
5. exp (만료일) 검증

검증 과정에서 실패하면 false를 반환하지만 만약 토큰이 무결함을 확인했는데 만료일이 지난 경우에만 Access Token 혹은 Refresh Token 재발급을 수행할 수 있도록 처리하기 위해 에러 처리를 해줬습니다.

- 토큰 재발급 함수

```ts
class Authorization {
    static tokenRefresh(refreshToken) {
        const tokenVerifyResult = this.verifyToken(refreshToken, "Refresh");
        if (tokenVerifyResult) return this.generateToken("Access");
        else return false;
    }
}
```

토큰 재발급 함수는 우선 Refresh Token에 대한 검증을 시도하고 만약 문제가 없다면 새로운 Access Token을, 문제가 있다면 fasle를 반환하도록 작성했습니다.


</div>
</details>

<details>
<summary>수요일</summary>
<div markdown="1">

### 로그인 시 토큰 전달

기존 쿠키와 세션을 함께 사용하던 방식에서 토큰을 이용하도록 변경하기 위해 

기존 쿠키 및 세션 설정 로직을 제거하고 토큰을 발급해서 전달하는 로직으로 수정해야 했습니다.

- 변경 전

```ts
//signInController.ts 기존 쿠키&세션 방식
const sid = sha1Encryption(email + Date.now().toString());

session.set(sid, result.id);

res.setCookie("sid", sid, { HttpOnly: true, Path: "/", "Max-Age": 30 * DAY });

res.setStatus(200).json({ redirect: "/" });
```

- 변경 후

```ts
//signInController.ts 토큰 방식
const accessToken = Authorization.generateToken("Access");
const refreshToken = Authorization.generateToken("Refresh");

res.setStatus(200).json({ redirect: "/", accessToken, refreshToken });
```

### Fetch 정형화

클라이언트가 로그인 이후 접근 권한이 필요한 모든 요청에 대해 토큰을 함께 보낼 수 있도록,

언제 Access Token이 재발급될지 모르기 때문에 응답 결과에 따라 항상 로컬 스토리지를 갱신할 수 있도록 하기 위해

Fetch를 정형화 할 필요가 있다고 생각했습니다.

```js
//loginLayout.js

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
```

기존에는 위처럼 각 페이지에서 fetch 모듈을 직접 호출하고 있었지만 

Access Token의 존재 여부를 확인하고 함께 전송해서 응답을 받았을 때 Access / Refresh Token이 존재한다면 갱신해주는 공용 fetch 함수를 작성해줬습니다.

저장 위치는 클라이언트의 Local Storage에 저장하기로 결정했고, 사용법은 MDN 문서를 참고했습니다.

https://developer.mozilla.org/en-US/docs/Web/API/Storage


```js
//fetch.js
async function fetchPOST(uri, data) {
    const accessToken = window.localStorage.getItem("accessToken");
    if (accessToken != null) data.accessToken = accessToken;

    await fetch(uri, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }).then(async (response) => {
        const contentType = response.headers.get("Content-Type");
        const isJSON = contentType === "application/json";
        return [response, isJSON ? await response.json() : {}];
    }).then(([response, body]) => {
        if (body.accessToken != null) {
            window.localStorage.setItem("accessToken", body.accessToken);
        }
        if (body.refreshToken != null) {
            window.localStorage.setItem("refreshToken", body.refreshToken);
        }
        return response;
    });
}

//loginLayout.js
fetchPOST(`${url}/user/login`, { email, password }).then((response) => {
	const isOK = 200;
	if (response.status === isOK) return response.json();
}).then((json) => {
	 if (json != null) window.location.href = json.redirect;
});
```

### Response 객체 중복 읽기 문제

앞서 fetch 함수에서 Access Token과 Refresh Token을 처리하기 위해 정형화를 시도했는데

그 과정에서 Response를 한 번 `.json()` 으로 읽고, 이후 Response 개체를 밖으로 반환해 추가 로직을 구현하려고 했었습니다.

```ts
// 첫번째 Response 사용 (토큰 처리)
return [response, isJSON ? await response.json() : {}];

// 두번째 외부에서 Response 사용
const isOK = 200;
if (response.status === isOK) return response.json();
```

그런데 Response 객체를 외부에서 사용을 시도 했을 때 아래의 에러를 만나게 되었습니다.

```
Uncaught (in promise) TypeError: Failed to execute 'json' on 'Response': body stream already read
```

해당 에러가 발생한 이유는 한 번 Response 객체를 읽으면 그 이후에는 같은 객체를 다시 읽을 수 없기 때문에 발생하는 문제였고,

이를 해결하기 위해 처음 Response 객체를 읽을 때 해당 객체를 클론해서 읽도록 변경하여 해결할 수 있었습니다.

```ts
//개선된 첫번째 Response 사용 (토큰 처리)
return [response, isJSON ? await response.clone().json() : {}];
```


### 토큰 유효성 확인하기

처음에는 토큰을 이용해서 클라이언트가 어떻게 로그인 상태인 것을 알 수 있도록 구현할까? 를 고민했습니다.

고민 과정에서 생각한 방법이 2가지 있었는데

1. Access Token을 보내서 토큰이 유효한지 확인하는 검증 요청만 보낸다.
2. Access Token을 보내서 토큰이 유효한지 확인하고 유저 정보를 가져오도록 한다.

어쨌든 결국 토큰에는 서버에서 관리하는 Secret이 포함되어 있기 때문에 Access Token을 보내서 유효한지 검증을 수행해야 한다고 생각했고, 

데이터를 제공하는 서버와 인증을 수행하는 서버가 현재는 동일하지만 인증을 수행하는 역할과 데이터를 전달하는 역할을 논리적으로 분리하고 싶다고 생각했습니다.

그렇기 때문에 토큰의 유효성만을 확인하는 방식으로 진행하도록 하겠습니다.

```js
// scripts/authorization.js
async function verifyAccessTokenValid() {
    const accessToken = window.localStorage.getItem("accessToken");
    if (accessToken == null) return false;

    return await fetchPOST(`${url}/autorization/login`, { email, password }).then(async (response) => {
        const isOK = 200;
        const UNATHORIZED = 401;
        if (response.status === isOK) {
            return true;
        }
        else if (response.status === UNATHORIZED) {
            return await requestTokenRefresh();
        } else {
            return false;
        }
    });
}
```

클라이언트는 메인 페이지를 불러올 때 토큰이 유효한지 확인하는데, 만약 로컬 스토리지에서 Access Token을 찾지 못한다면 인증을 거치지 않고 바로 비로그인 상태로 간주하도록 했습니다.

만약 토큰 검증 요청을 보냈을 때 유효하다면 상태코드 200을, 만료됐다면 401을, 
서버 에러 혹은 토큰 변조 등으로 인한 검증이 불가능한 상황이라면 false를 반환해 비로그인 상태임을 알리도록 했습니다.

### 서버 측 토큰 검증 결과 반환 로직 작성

```ts
//app.ts
routeStack.use("/authorization", authorizeRouter);

//authorizeRouter.ts
authorizeRouter.post("/authorization/verify", verifyController);

//authorizeController.ts
function verifyController(req, res) {
    try {
        const accesstoken = req.body.accessToken;
        const isVerified = Authorization.verifyToken(accesstoken, "Access");

        if (isVerified) {
            res.setStatus(200).send();
        } else {
            res.setStatus(401).send();
        }
    } catch (e) {
        logger.warn("e");
        res.setStatus(403).send();
    }
}
```

서버에선 미리 만들어둔 Authorization 클래스를 이용해 토큰을 검증하고, 결과에 따라 상태 코드를 다르게 응답합니다.

### 클라이언트 토큰 리프레시 요청 작성

만약 클라이언트에서 Access Token을 받았는데 401(Unauthorized) 응답을 받는 경우 Refresh Token을 이용해 Access Token을 재발급 받는 함수를 실행합니다.

```js
async function requestTokenRefresh() {
    const refreshToken = window.localStorage.getItem("refreshToken");
    if (refreshToken == null) return false;

    return await fetchPOST(`${url}/authorization/refresh`, { refreshToken }).then(async (response) => {
        const isOK = 200;
        if (response.status === isOK) {
            return true;
        } else {
            return false;
        }
    });
}
```

### 토큰 리프레시 응답 로직 작성

```ts
//authorizeRouter.ts
authorizeRouter.post("/authorization/refresh", tokenRefreshController);

//authorizeController.ts
function tokenRefreshController(req, res) {
    try {
        const refreshToken = req.body.refreshToken;
        const accessToken = Authorization.tokenRefresh(refreshToken);
        if (accessToken) {
            res.setStatus(200).json({ accessToken });
        } else {
            res.setStatus(401).send();
        }
    } catch (e) {
        logger.warn(e);
        res.setStatus(403).send();
    }
}
```

### 토큰 검증 여부에 따라 다른 상태 렌더링 하기

```js
//mainLayout.js
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
        ...
```

### 로그아웃 처리

```ts
//mainLayout.js
function addEvent(isLogin) {
    if (isLogin) {
        document.getElementById("user-logout-button").addEventListener("click", (event) => {
            window.localStorage.removeItem("accessToken");
            window.localStorage.removeItem("refreshToken");
            window.location.reload();
        });
        ...
```

클라이언트에서 로그아웃 버튼을 누르면 클라이언트에서 보관하고 있던 토큰을 파기하고, 새로고침 하는 것으로 처리할 수 있었습니다.

</div>
</details>

<details>
<summary>목요일</summary>
<div markdown="1">

### 게시판 기능을 포함한 ERD 다시 그리기

<img src="https://i.ibb.co/dMdrk8r/Pasted-image-20241010172624.png" alt="post-erd">

```sql
CREATE TABLE member (
  email VARCHAR(30) NOT NULL,
  password VARCHAR(100) NOT NULL,
  name VARCHAR(20) NOT NULL,
  PRIMARY KEY (email)
);
  
CREATE TABLE post (
  id INT AUTO_INCREMENT,
  member_email VARCHAR(30) NOT NULL,
  title VARCHAR(50) NOT NULL,
  author VARCHAR(20) NOT NULL,
  createAt TIMESTAMP NOT NULL,
  content VARCHAR(1000) NOT NULL,
  view INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (member_email) REFERENCES member(email)
);
  
CREATE TABLE comment (
  id INT AUTO_INCREMENT,
  post_id INT NOT NULL,
  author VARCHAR(20) NOT NULL,
  createAt TIMESTAMP NOT NULL,
  content VARCHAR(200) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (post_id) REFERENCES post(id)
);
```

### mock 데이터 삽입

우선은 게시판 기능 중에서도 조회를 먼저 구현하기 위해서 각 `memeber` `post` `comment` 테이블에 mock 데이터를 삽입하려고 합니다.

mock 데이터는 테이블을 기반으로 GPT를 이용해 .csv 파일의 형태로 생성했습니다.

```console
scp member.csv jinyoung@[HOST]:home/jinyoung
...외 2개
```

로컬 PC의 파일을 VM 환경에 전송해줬고, mysql에서 읽을 수 있는 위치로 옮겨줬습니다. 

```bash
sudo mv member.csv /var/lib/mysql-files
...외 2개
```

이후 `LOAD DATA`를 이용해  파일을 삽입해줬습니다.

```bash
LOAD DATA INFILE '/var/lib/mysql-files/comment.csv'  
INTO TABLE comment  
FIELDS TERMINATED BY ','  
ENCLOSED BY '"' LINES  
TERMINATED BY '\n'  
IGNORE 1 LINES  
(id,post_id,author,createAt,content);
...외 2개
```

### 메인 페이지 게시판 레이아웃

post_id를 기준으로 내림차순 한 페이지당 10개 씩, 5페이지 단위의 존재 여부를 보여줄 예정이기 때문에
한 번의 조회마다 최대 50개의 게시글을 가져오고,

5페이지 넘어가기 버튼을 눌렀을 때 다음 게시글 50개를 가져와서 렌더링 하는 방식으로 구현할 예정

### 글 작성 페이지

### 글 보기 페이지

### 유저 리스트 페이지

```
시나리오

주소창에 입력 -> 페이지를 내려줌 -> 토큰 인증 함수 호출 -> 
- 문제 없으면 데이터 요청 -> 데이터 받고 렌더링
- 문제 있으면 로그인 창으로 리디렉션
```

```ts
//UserRepository.ts
class UserRepository {
    static async getUserPublicData() {
        return await DBManager.select({
            table: this.tableName,
            column: "email, name",
            condition: null
        });
    }
```


### 에러 페이지

### 피드백 반영

</div>
</details>


</div>
</details>
