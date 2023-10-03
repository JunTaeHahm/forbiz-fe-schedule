# node 버전 설정
FROM node:18.15.0

# 패키지 파일들을 복사
COPY package*.json ./

# puppeteer 패키지 및 환경변수 설정
RUN apt-get update \
 && apt-get install -y chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgbm1 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libxss1 \
    lsb-release \
    xdg-utils


ENV DISPLAY=:99
ENV NODE_ENV=production
ENV VITE_APP_NODE_ENV=production
ENV VITE_APP_SERVER_BASE_URL=https://large-cassandre-juntaehahm.koyeb.app

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
