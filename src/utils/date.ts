import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

/**
 * 날짜 포맷하기
 * @param d 포맷할 날짜 string
 * @returns YYYY-MM-DD HH:mm:ss
 */
export const formatDate = (d: Date | string, type: 'date' | 'api' = 'date') => {
  if (null === d || undefined === d || '' === d) return '';

  if (type === 'api') {
    const date = new Date(d);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해야 함
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
  }

  return dayjs.utc(d).format('YYYY-MM-DD HH:mm:ss');
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
