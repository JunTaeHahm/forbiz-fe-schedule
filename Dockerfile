# node 버전 설정
FROM node:18.15.0

# 패키지 파일들을 복사
COPY package*.json ./

# puppeteer 패키지 및 환경변수 설정
RUN apt-get update \
 && apt-get install -y chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

# 작업경로 설정
WORKDIR app/

# 패키지 파일 복사
COPY --chown=node package.json .
COPY --chown=node package-lock.json .

# 패키지 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# 앱 빌드
RUN npm run build  # 앱 빌드

# 서버 시작
CMD ["node", "server.js"]
