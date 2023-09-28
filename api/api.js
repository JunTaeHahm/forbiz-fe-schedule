import express from 'express';
import dotenv from 'dotenv';
import { chromium } from 'playwright';
import axios from 'axios';

dotenv.config();

const router = express.Router();

// #region playwright 옵션 설정 및 실행
const { USER_ID, USER_PW } = process.env;

/* 브라우저 설정 */
const browser = await chromium.launch({
  headless: true,
});
const context = await browser.newContext({
  viewport: {
    // width: 1920,
    // height: 1080,
    width: 1024,
    height: 768,
  },
  acceptDownloads: true,
});
const page = await context.newPage();
await page.goto('https://gw.forbiz.co.kr/gw/userMain.do');

/* 로그인 */
const loginIdSelector = '#userId';
const loginPwSelector = '#userPw';
const loginSubmitSelector = '.login_submit';

const userIdElement = await page.$(loginIdSelector);
const userPwElement = await page.$(loginPwSelector);

if (userIdElement && userPwElement) {
  await page.fill(loginIdSelector, USER_ID);
  await page.fill(loginPwSelector, USER_PW);
  await page.click(loginSubmitSelector);
}

/* 브라우저 쿠키 가져오기 */
const cookies = await context.cookies();

const selectedCookie = cookies.find((cookie) => cookie.path === '/gw');
const cookie = selectedCookie ? { name: selectedCookie.name, value: selectedCookie.value } : null;
// #endregion

/** 주간 일정 가져오기 */
router.post('/getWeekSchedule', async (req, res) => {
  const { calType, startDate, endDate, mcalSeq, mySchYn } = req.body;

  try {
    const response = await axios({
      url: 'https://gw.forbiz.co.kr/schedule/WebMtSchedule/SearchMtScheduleList',
      method: 'POST',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${cookie.name}=${cookie.value};`,
      },
      data: {
        calType,
        startDate,
        endDate,
        mcalSeq,
        mySchYn,
      },
    });

    res.status(200).send(response.data.result.schList);
  } catch (error) {
    console.error(error);
  }
});

/** 일정 상세 데이터 가져오기 */
router.post('/getScheduleDetail', async (req, res) => {
  const { schSeq } = req.body;

  try {
    const response = await axios({
      url: 'https://gw.forbiz.co.kr/schedule/WebMtSchedule/SearchMtSchedule',
      method: 'POST',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${cookie.name}=${cookie.value};`,
      },
      data: {
        detailYn: 'Y',
        schSeq,
        schmSeq: schSeq,
      },
    });

    const { startDate, endDate, createName, schUserList } = response.data.result;
    const sharedUser = schUserList.filter((v) => v.userType === '10');
    const filteredResult = {
      startDate,
      endDate,
      createName,
      sharedUser: sharedUser.map((v) => v.orgName),
    };

    res.status(200).send(filteredResult);
  } catch (error) {
    console.error(error);
  }
});

export default router;
