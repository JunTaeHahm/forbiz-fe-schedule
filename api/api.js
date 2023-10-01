import express from 'express';
import dotenv from 'dotenv';
import { chromium } from 'playwright';
import axios from 'axios';

dotenv.config();

const router = express.Router();
const { USER_ID, USER_PW } = process.env;

// ID/PW 환경변수에 없으면 에러 발생
if (!USER_ID || !USER_PW) {
  throw new Error('환경변수의 ID/PW 설정이 필요합니다.');
}

/**
 * 브라우저 설정 및 쿠키 가져오기
 * @returns cookie
 */
const setBrowser = async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1024, height: 768 }, acceptDownloads: true });
  const page = await context.newPage();

  await page.goto('https://gw.forbiz.co.kr/gw/userMain.do');
  await page.fill('#userId', USER_ID);
  await page.fill('#userPw', USER_PW);
  await page.click('.login_submit');

  const cookies = await context.cookies();
  const cookie = cookies.find((v) => v.path === '/gw');
  if (!cookie) throw new Error('Failed to retrieve cookies');

  return { name: cookie.name, value: cookie.value };
};

router.post('/getWeekSchedule', async (req, res) => {
  const { calType, startDate, endDate, mcalSeq, mySchYn } = req.body;

  try {
    const cookie = await setBrowser();

    const response = await axios.post(
      'https://gw.forbiz.co.kr/schedule/WebMtSchedule/SearchMtScheduleList',
      { calType, startDate, endDate, mcalSeq, mySchYn },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Cookie: `${cookie.name}=${cookie.value};`,
        },
      },
    );

    res.status(200).send(response.data.result.schList);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/getDetailSchedule', async (req, res) => {
  const { detailYn, schSeq: schSeqList } = req.body;

  try {
    const cookie = await setBrowser();

    const result = await Promise.all(
      schSeqList.map(async (schSeq) => {
        const response = await axios.post(
          'https://gw.forbiz.co.kr/schedule/WebMtSchedule/SearchMtSchedule',
          { detailYn, schSeq, schmSeq: schSeq },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Cookie: `${cookie.name}=${cookie.value};`,
            },
          },
        );

        return response.data.result;
      }),
    );

    const shareScheduleList = [];
    result.forEach((v) => {
      shareScheduleList.push({
        schTitle: v.schTitle,
        createName: v.createName,
        userList: v.schUserList.filter((user) => user.userType === '10').map((v) => v.orgName),
        startDate: v.startDate,
        endDate: v.endDate,
      });
    });

    res.status(200).send(shareScheduleList);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
