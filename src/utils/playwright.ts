import { chromium } from 'playwright';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

require('dotenv').config();
dayjs.locale('ko');

const { USER_ID, USER_PW } = process.env;

export const runPlaywrightScript = async () => {
  try {
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

    /* #region 로그인 */
    const loginIdSelector = '#userId';
    const loginPwSelector = '#userPw';
    const loginSubmitSelector = '.login_submit';

    const userIdElement = await page.$(loginIdSelector);
    const userPwElement = await page.$(loginPwSelector);

    if (userIdElement && userPwElement) {
      await page.fill(loginIdSelector, USER_ID ?? '');
      await page.fill(loginPwSelector, USER_PW ?? '');
      await page.click(loginSubmitSelector);
    }
    /* #endregion */

    // /* #region 일정 메뉴 진입 */
    // const scheduleMenuSelector = '#topMenu300000000';
    // const fePartSelector = '[aria-labelledby="301040000_125_anchor"] > a';

    // const scheduleMenuElement = page.$(scheduleMenuSelector);
    // const fePartElement = page.$(fePartSelector);

    // if (scheduleMenuElement && fePartElement) {
    //   await page.click(scheduleMenuSelector);
    //   await page.click(fePartSelector);
    // }
    // /* #endregion */

    // /* #region 일 버튼, 내 일정만 보기 버튼 클릭 */
    // const frame = page.frame('_content'); // iframe 내용이라

    // if (!frame) {
    //   console.log('iframe이 없습니다.');
    //   return;
    // }

    // const dayBtnSelector = 'button.fc-agendaDay-button:has-text("일")';
    // const onlyMineSelector = '#worklist_sel';

    // await frame.waitForLoadState();

    // const dayBtnElement = frame.waitForSelector(dayBtnSelector, { timeout: 3000 });
    // const onlyMineElement = frame.waitForSelector(onlyMineSelector, { timeout: 3000 });

    // if (dayBtnElement && onlyMineElement) {
    //   await frame.click(dayBtnSelector);
    //   await frame.click(onlyMineSelector);
    // }
    // /* #endregion */

    // page.on('dialog', async (dialog) => {
    //   console.log('Confirm message:', dialog.message());
    //   await dialog.accept();
    // });

    // 로그인 후 쿠키 불러오기
    /* #region 쿠키 설정 */
    const cookies = await context.cookies();

    const selectedCookie = cookies.find((cookie) => cookie.path === '/gw');
    const cookie = selectedCookie ? { name: selectedCookie.name, value: selectedCookie.value } : null;
    /* #endregion */

    /* #region FE팀 개인별 주간 일정 가져오기 */
    const feSchList = await page.evaluate(async (cookie) => {
      try {
        const today = new Date();
        const currentDay = today.getDay();

        const monday = new Date(today);
        const friday = new Date(monday);

        monday.setDate(monday.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
        friday.setDate(friday.getDate() + 4);

        // YY-MM-DD HH:MM 형태로 변환
        const formatDate = (date: Date) =>
          `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(
            2,
            '0',
          )}`;

        const startDate = formatDate(monday);
        const endDate = formatDate(friday);

        const response = await fetch('https://gw.forbiz.co.kr/schedule/WebMtSchedule/SearchMtWeekScheduleList', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookie?.name}=${cookie?.value};`,
          },
          body: JSON.stringify({
            companyInfo: '',
            startDate,
            endDate,
            schTitle: '',
            mcalSeq: '125',
            mySchYn: 'N', // 내 스케쥴만 볼것 인지
          }),
        });

        // 응답을 JSON 형태로 파싱
        return response.json();
      } catch (error) {
        console.error(error);

        return null;
      }
    }, cookie); // cookie를 evaluate의 인자로 전달

    // console.log('feSchList.result.schList', feSchList.result.schList);
    const date = dayjs('2023-09-21T15:30:00.000Z').format('YY-MM-DD HH:mm');
    console.log('date: ', date);

    // const filteredSchList = feSchList.result.schList.map((item) => {
    //   const startDate = dayjs(item.startDate).format('YY-MM-DD HH:mm');
    //   const endDate = dayjs(item.endDate).format('YY-MM-DD HH:mm');

    //   return {
    //     startDate,
    //     endDate,
    //     schTitle: item.schTitle,
    //     createName: item.createName,
    //   };
    // });
    /* #endregion */

    // console.log('추출 값: ', filteredSchList);

    // filteredSchList.sort((a, b) => dayjs(a.startDate, 'YY-MM-DD HH:mm'));

    // const groupedList = filteredSchList.reduce((acc, cur) => {
    //   (acc[cur.createName] = acc[cur.createName] || []).push(cur);
    //   return acc;
    // }, {});

    // return filteredSchList;
  } catch (error) {
    console.log('에러가 발생했습니다: ', error);
  }
};
