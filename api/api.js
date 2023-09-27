import dayjs from 'dayjs';
import express from 'express';
import dotenv from 'dotenv';
import { chromium } from 'playwright';

dotenv.config();

const router = express.Router();
const now = dayjs();

const { USER_ID, USER_PW } = process.env;

router.get('/getData', async (req, res) => {
  try {
    const browser = await chromium.launch({
      headless: false,
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

    /* #region 로그인 */
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
  } catch (error) {
    console.error(error);
  }
});

export default router;
