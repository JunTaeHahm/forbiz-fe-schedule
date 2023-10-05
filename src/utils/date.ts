import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

/**
 * 날짜 포맷하기
 * @param d 포맷할 날짜 string
 * @returns YYYY-MM-DD HH:mm:ss
 */
export const formatDate = (d: Date | string, type: 'date' | 'api' | 'kor' = 'date') => {
  if (null === d || undefined === d || '' === d) return '';

  const date = new Date(d);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해야 함
  const day = String(date.getDate()).padStart(2, '0');

  switch (type) {
    case 'api':
      return `${year}${month}${day}`;
    case 'kor':
      return `${year}년 ${month}월 ${day}일`;
    default:
      return dayjs.utc(d).format('YYYY-MM-DD HH:mm:ss');
  }
};

/**
 * 특정 날짜보다 이전인지 구하기
 * @param standardD 기준 날짜 string
 * @param compareD 비교 날짜 string
 * @returns boolean
 */
export const isBeforeDate = (standardD: string | Date, compareD: string | Date) => {
  const standardDate = dayjs(standardD);
  const compareDate = dayjs(compareD);

  return compareDate.isBefore(standardDate);
};

/**
 * 특정 날짜보다 이후인지 구하기
 * @param standardD 기준 날짜 string
 * @param compareD 비교 날짜 string
 * @returns boolean
 */
export const isAfterDate = (standardD: string | Date, compareD: string | Date) => {
  const standardDate = dayjs(standardD);
  const compareDate = dayjs(compareD);

  return compareDate.isAfter(standardDate);
};

/**
 * 이번주 시작일과 종료일 구하기
 * @returns startDate, endDate
 */
export const useCalculateWeek = () => {
  const today = new Date();
  const currentDay = today.getDay();

  const monday = new Date(today);
  const friday = new Date(monday);

  monday.setDate(monday.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
  monday.setHours(0, 0, 0, 0); // 월요일의 시간을 00시 00분 00초로 설정

  friday.setDate(friday.getDate() + 4);
  friday.setHours(23, 59, 59, 999); // 금요일의 시간을 23시 59분 59초로 설정

  const startDate = formatDate(monday);
  const endDate = formatDate(friday);

  return { startDate, endDate };
};
