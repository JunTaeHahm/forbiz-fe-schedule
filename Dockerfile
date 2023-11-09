# node 버전 설정
FROM node:slim

# 패키지 파일들을 복사
COPY package*.json ./

# puppeteer 패키지 및 환경변수 설정
# Puppeteer가 Chromium을 실행하기 위해 필요한 종속성을 설치합니다.
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    dbus-x11 \
    fonts-liberation \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    # Xvfb를 설치합니다.
    xvfb \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 환경변수 설정
ENV NODE_ENV=production
ENV VITE_APP_NODE_ENV=production
ENV VITE_APP_SERVER_BASE_URL=https://large-cassandre-juntaehahm.koyeb.app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
# Puppeteer가 사용할 Chromium의 경로를 설정합니다.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# 작업경로 설정
WORKDIR /app

# 패키지 파일 복사 및 설치
COPY --chown=node package.json package-lock.json ./
RUN npm ci

# 소스 코드 복사 및 빌드
COPY --chown=node . .
RUN npm run build

# Xvfb를 사용하여 가상의 디스플레이 서버를 시작합니다.
# 이는 컨테이너 내부에서 Puppeteer가 GUI 없이 작동하도록 하는데 필요합니다.
CMD Xvfb :99 -screen 0 1024x768x16 &
ENV DISPLAY=:99

# 서버 시작
CMD ["node", "server.js"]
