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

    - CSS 컬러 및 사이즈 템플릿 선언
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
