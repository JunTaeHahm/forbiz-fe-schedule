import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import apiRouter from './api/api.js';
import { fileURLToPath } from 'url';

// ES module에서 __dirname 사용하는 법
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const __filename = fileURLToPath(import.meta.url);

// Express 앱 생성
const app = express();

// HTTP 서버 생성
const httpServer = http.createServer(app);

// CORS 설정: 개발 환경과 배포 환경의 origin을 설정
app.use(
  cors({
    origin: ['http://localhost:3000'], // TODO: 배포 후 추가적인 origin 추가 필요
    credentials: true,
  }),
);

// 정적 파일 제공 설정: build 디렉터리의 파일들을 캐싱과 함께 제공
const buildDirectory = path.join(__dirname, 'build');
app.use(express.static(buildDirectory, { maxAge: 2629800, immutable: true }));

// src 디렉터리에 대한 별도의 정적 파일 제공 설정
const srcDirectory = path.join(__dirname, 'build/src');
app.use('/src', express.static(srcDirectory, { maxAge: 2629800, immutable: true }));

// JSON 및 URL 인코딩 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 라우터 설정
app.use('/api', apiRouter);

// 모든 기타 요청은 index.html로 리다이렉트
app.get('*', (req, res) => {
  res.sendFile(path.join(buildDirectory, 'index.html'));
});

// 서버 시작
const PORT = process.env.PORT || 3000; // 환경 변수에 PORT가 없는 경우, 기본적으로 3000 포트 사용
httpServer.listen(PORT, () => {
  console.log(`Express:: ${PORT} 포트 오픈`);
});
