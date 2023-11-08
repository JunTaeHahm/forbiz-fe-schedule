import { WORK_TIME } from '@/configs/workTime.config';
import { WeekSchedule } from '@/types/schedule.types';
import { Time, WorkTime } from '@/types/time.types';
import { isAfterDate } from '@/utils/date';

/**
 * 일정 종료시간이 점심시간 시작인지, 퇴근시간인지 확인
 * @param d 일정 종료 시간
 * @param workTime 출퇴근 시간
 * @returns boolean
 */
export const isPublicStartTime = (d: string, workTime: WorkTime): boolean => {
  const date = new Date(d);
  const hour = date.getHours();
  const minute = date.getMinutes();

  const { endH, endM } = workTime;

  return (hour === 12 && minute === 30) || (hour === endH && minute === endM);
};

/**
 * 일정 시작시간이 점심시간 종료인지, 출근시간인지 확인
 * @param d 일정 시작 시간
 * @param workTime 출퇴근 시간
 * @returns boolean
 */
export const isPublicEndTime = (d: string, workTime: WorkTime): boolean => {
  const date = new Date(d);
  const hour = date.getHours();
  const minute = date.getMinutes();

  const { startH, startM } = workTime;

  return (hour === 13 && minute === 30) || (hour === startH && minute === startM);
};

/**
 * 주간 일정의 시간, OT여부, OT시간을 계산
 * @param schedule 주간 일정
 * @returns 일정 시간, OT여부, OT시간
 */
export const useCalculateTime = (schedule: WeekSchedule): Time => {
  /** 시간만 계산하기 위해서 연/월/일 통일 */
  const currentTime = new Date();
  const year = currentTime.getFullYear();
  const month = currentTime.getMonth();
  const date = currentTime.getDate();

  /** 일정 시작/종료 시간 */
  const startTime = new Date(schedule.startDate);
  const endTime = new Date(schedule.endDate);
  startTime.setFullYear(year, month, date);
  endTime.setFullYear(year, month, date);

  /** 업무 종료 시간 */
  const memberName = schedule.createName;

  const endWorkTime = new Date();
  endWorkTime.setHours(WORK_TIME[memberName].endH, WORK_TIME[memberName].endM, 0, 0);

  /** 일정 및 OT 시간 계산 */
  const time = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  const hasOverTime = isAfterDate(endWorkTime, endTime);
  const overTime = hasOverTime ? (endTime.getTime() - endWorkTime.getTime()) / (1000 * 60 * 60) : 0;

  return { time, hasOverTime, overTime };
};

export const calculateTime = (timeRange: string) => {
  // Split the string by the '~' character
  const times = timeRange.split('~').map((t) => t.trim());

  // Parse the start and end times
  const [startHour, startMinute] = times[0].split(':').map(Number);
  const [endHour, endMinute] = times[1].split(':').map(Number);

  // Calculate the total minutes for start and end times
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  // Calculate the difference in minutes
  const diffMinutes = endTotalMinutes - startTotalMinutes;

  // Convert minutes to hours with half-hour increments
  const diffInHours = diffMinutes / 60;

  return diffInHours;
};
