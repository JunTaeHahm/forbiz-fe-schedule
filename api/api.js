import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';
import fs from 'fs';

dotenv.config();

const router = express.Router();
const { USER_ID, USER_PW } = process.env;
const downloadPath = path.resolve('./excel');

if (!USER_ID || !USER_PW) {
  throw new Error('환경변수의 ID/PW 설정이 필요합니다.');
}

// 파일이 다운로드될 때까지 기다리는 함수
async function waitForExcelFile(excelFolder, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    // 폴링 함수
    function poll() {
      const excelFiles = fs
        .readdirSync(excelFolder)
        .filter((file) => path.extname(file).toLowerCase() === '.xlsx')
        .map((file) => path.join(excelFolder, file));

      if (excelFiles.length > 0) {
        resolve(excelFiles[0]); // 첫 번째 .xlsx 파일 경로를 반환
      } else if (Date.now() - startTime >= timeout) {
        reject(new Error('Timeout waiting for the .xlsx file'));
      } else {
        setTimeout(poll, 500); // 0.5초 후에 다시 폴링
      }
    }

    poll(); // 폴링 시작
  });
}

const setBrowser = async () => {
  // 디렉토리 내의 모든 파일을 가져옵니다.
  const files = fs.readdirSync(downloadPath);

  // 각 파일을 순회하며 삭제합니다.
  files.forEach((file) => {
    const filePath = path.join(downloadPath, file);
    // 디렉토리인지 확인합니다. (선택적)
    if (fs.statSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    }
  });

  console.log('All files have been deleted.');

  const browser = await puppeteer.launch({
    // headless: 'new',
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--single-process',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
    ],
    ignoreHTTPSErrors: true,
    devtools: false,
    protocolTimeout: 60000,
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1024, height: 768 });

  // 페이지 진입
  await page.goto('https://gw.forbiz.co.kr/gw/userMain.do', { waitUntil: 'networkidle0' });

  // 로그인
  await page.type('#userId', USER_ID);
  await page.type('#userPw', USER_PW);
  await page.click('.login_submit');

  // 일정 진입
  await page.waitForSelector('#topMenu300000000', { visible: true });
  await page.click('#topMenu300000000');

  // FE팀 일정 진입
  await page.waitForSelector('[aria-labelledby="301040000_125_anchor"] > a', { visible: true });
  await page.click('[aria-labelledby="301040000_125_anchor"] > a');

  // iframe 찾기
  const frame = await page.frames().find((f) => f.name() === '_content');

  // [개인별 주간] 클릭
  await frame.waitForSelector('button.fc-personalWeek-button', { visible: true });
  await frame.evaluate(() => {
    document.querySelector('button.fc-personalWeek-button').click();
  });
  await frame.waitForTimeout(2000);

  // [지난 주]
  await frame.waitForSelector('li.pre > a', { visible: true });
  await frame.evaluate(() => {
    document.querySelector('li.pre > a').click();
  });

  await frame.waitForTimeout(1000);

  // const cookies = await page.cookies();
  // const cookie = cookies.find((v) => v.path === '/gw');
  // if (!cookie) throw new Error('Failed to retrieve cookies');

  // return { name: cookie.name, value: cookie.value };

  // [엑셀] 클릭 후 파일 다운로드 설정
  await frame.waitForSelector('.submit.puddSetup', { visible: true });
  await frame.evaluate(() => {
    document.querySelector('.submit.puddSetup').click();
  });

  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath,
  });

  // 파일이 다운로드될 때까지 기다리고 처리합니다.
  try {
    const firstExcelFile = await waitForExcelFile(downloadPath);
    // 파일 처리 로직
    const workbook = XLSX.readFile(firstExcelFile);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    console.log('data: ', data);
  } catch (error) {
    console.error(error.message);
  }

  // await browser.close();
};

await setBrowser();

// router.post('/getWeekSchedule', async (req, res) => {
//   const { calType, startDate, endDate, mcalSeq, mySchYn } = req.body;

//   try {
//     const cookie = await setBrowser();

//     const response = await axios.post(
//       'https://gw.forbiz.co.kr/schedule/WebMtSchedule/SearchMtScheduleList',
//       { calType, startDate, endDate, mcalSeq, mySchYn },
//       {
//         withCredentials: true,
//         headers: {
//           'Content-Type': 'application/json',
//           Cookie: `${cookie.name}=${cookie.value};`,
//         },
//       },
//     );

//     res.status(200).send(response.data.result.schList);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// router.post('/getDetailSchedule', async (req, res) => {
//   const { detailYn, schSeq: schSeqList } = req.body;

//   try {
//     const cookie = await setBrowser();

//     const result = await Promise.all(
//       schSeqList.map(async (schSeq) => {
//         const response = await axios.post(
//           'https://gw.forbiz.co.kr/schedule/WebMtSchedule/SearchMtSchedule',
//           { detailYn, schSeq, schmSeq: schSeq },
//           {
//             withCredentials: true,
//             headers: {
//               'Content-Type': 'application/json',
//               Cookie: `${cookie.name}=${cookie.value};`,
//             },
//           },
//         );

//         return response.data.result;
//       }),
//     );

//     const shareScheduleList = [];
//     result.forEach((v) => {
//       shareScheduleList.push({
//         schTitle: v.schTitle,
//         createName: v.createName,
//         userList: v.schUserList.filter((user) => user.userType === '10').map((v) => v.orgName),
//         startDate: v.startDate,
//         endDate: v.endDate,
//       });
//     });

//     res.status(200).send(shareScheduleList);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

export default router;
