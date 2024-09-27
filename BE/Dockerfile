# MySQL 공식 이미지를 기반으로 생성
FROM mysql:latest

# 환경 변수 설정
ENV MYSQL_ROOT_PASSWORD=0000
ENV MYSQL_DATABASE=db1004
ENV MYSQL_USER=zizone
ENV MYSQL_PASSWORD=ganzi
COPY ./init.sql /docker-entrypoint-initdb.d/ß

# MySQL의 기본 포트(3306) 노출
EXPOSE 3306

# MySQL 서버 실행
CMD ["mysqld"]
