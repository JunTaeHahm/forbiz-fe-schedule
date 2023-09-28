import { computed, onMounted, ref } from 'vue';
import ScheduleService from '@/services/schedules';
import { GetWeekScheduleItem } from '@/types/schedule.types';
import { formatDate, isAfterDate } from '@/utils/date';
type WeekSchedule = Pick<GetWeekScheduleItem, 'startDate' | 'endDate' | 'createName' | 'schTitle' | 'schSeq'>;
interface ScheduleResult {
  time: number;
  overTime: number;
  title: Set<string>;
}

const END_WORK_HOUR = 18;

const scheduleService = new ScheduleService();

export default function useWeekSchedule() {
  const weekScheduleList = ref<WeekSchedule[]>([]);
  const members = computed(() => [...new Set(weekScheduleList.value.map((schedule) => schedule.createName))].sort());

  const today = new Date();
  const currentDay = today.getDay();

  const monday = new Date(today);
  const friday = new Date(monday);

  monday.setDate(monday.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
  friday.setDate(friday.getDate() + 4);

  const startDate = formatDate(monday);
  const endDate = formatDate(friday);

  const schedules = computed(() =>
    members.value.map((name) => {
      const filteredSchedules = weekScheduleList.value.filter((schedule) => schedule.createName === name);
      const result: Record<string, ScheduleResult> = {};

      filteredSchedules.forEach((schedule, i, arr) => {
        const match = schedule.schTitle.match(/\[(.*?)\]/);
        if (!match) return;

        const projectName = `[${match[1]}]`;
        const title = match.input?.replace(projectName, '').trim() ?? '';
        const { time, hasOverTime, overTime } = calculateTime(schedule);
        console.log('arr[i].endDate: ', arr[i].endDate);
        console.log('arr[i+1].startDate: ', arr[i + 1]?.startDate);

        const isFeSchedule = projectName === '[FE]';

        if (hasOverTime) {
          // OT 있을 경우
          if (!result[projectName]) {
            result[projectName] = { time: time - overTime, overTime, title: new Set([title]) };
          }

          result[projectName].time! += time - overTime; // 모든 투입시간에서 OT 시간 뺀 값
          result[projectName].overTime! += overTime; // OT 시간
          result[projectName].title?.add(title); // 업무내용
        } else {
          // OT 없을 경우
          if (!result[projectName]) {
            result[projectName] = { time: 0, overTime: 0, title: new Set() };
          }

          if (isFeSchedule) result[projectName].title?.add(title); // FE 업무일 때 내용 추가

          result[projectName].time! += time; // 투입시간만 할당
        }
      });

      return result;
    }),
  );

  function calculateTime(schedule: WeekSchedule): { time: number; hasOverTime: boolean; overTime: number } {
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = currentTime.getMonth();
    const date = currentTime.getDate();

    const startTime = new Date(schedule.startDate);
    const endTime = new Date(schedule.endDate);
    startTime.setFullYear(year, month, date);
    endTime.setFullYear(year, month, date);

    const endWorkTime = new Date();
    endWorkTime.setHours(END_WORK_HOUR, 0, 0, 0);

    const time = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const hasOverTime = isAfterDate(endWorkTime, endTime);
    const overTime = hasOverTime ? (endTime.getTime() - endWorkTime.getTime()) / (1000 * 60 * 60) : 0;

    return { time, hasOverTime, overTime };
  }

  const getWeekSchedule = async () => {
    try {
      const response = await scheduleService.getWeekSchedule({
        calType: 'M',
        startDate: formatDate(startDate, 'api'),
        endDate: formatDate(endDate, 'api'),
        mcalSeq: '125',
        mySchYn: 'N',
      });

      weekScheduleList.value = response.map((schedule) => ({
        ...schedule,
        startDate: formatDate(schedule.startDate),
        endDate: formatDate(schedule.endDate),
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const init = async () => {
    await getWeekSchedule();
  };

  onMounted(() => {
    init();
  });

  return { weekScheduleList, members, schedules };
}
