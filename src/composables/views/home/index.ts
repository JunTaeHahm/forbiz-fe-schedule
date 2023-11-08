import { computed, onMounted, reactive, ref } from 'vue';
import ScheduleService from '@/services/schedules';
import { FeMember, ProjectRecord, MemberRecord, ScheduleObj } from '@/types/schedule.types';
import { useCalculateWeek } from '@/utils/date';
import dayjs from 'dayjs';

export default function homeComposable() {
  // #region 이번주 시작일과 종료일
  const startDate = ref(useCalculateWeek().startDate);
  const endDate = ref(useCalculateWeek().endDate);

  // #endregion

  // #region fetches
  type FetchKey = 'getWeekSchedule';

  type FetchState = 'wait' | 'ing' | 'success' | 'error';

  type Fetches = Record<FetchKey, FetchState>;

  const fetches = reactive<Fetches>({
    getWeekSchedule: 'wait',
  });

  const fetch = {
    wait: (key: FetchKey) => {
      fetches[key] = 'wait';
    },
    start: (key: FetchKey) => {
      fetches[key] = 'ing';
    },
    isSuccess: (key: FetchKey) => {
      fetches[key] = 'success';
    },
    isError: (key: FetchKey) => {
      fetches[key] = 'error';
    },
  };

  const isLoading = computed(() => {
    return fetches.getWeekSchedule === 'ing' || fetches.getWeekSchedule === 'wait';
  });

  const isError = computed(() => {
    return fetches.getWeekSchedule === 'error';
  });

  const checkStatus = (fetch: FetchState) => {
    if (fetch === 'wait' || fetch === 'ing') {
      return '🟠 Loading';
    } else if (fetch === 'error') {
      return '🔴 Error';
    } else {
      return '🟢 Success';
    }
  };
  // #endregion

  // #region 서비스
  const scheduleService = new ScheduleService();
  // #endregion

  const scheduleList = ref<MemberRecord>();

  const isFeMember = (target: string): target is FeMember => {
    return [
      '김석진',
      '김승우',
      '김태이',
      '윤보라',
      '임지원',
      '전동엽',
      '전민주',
      '정수범',
      '정재원',
      '함준태',
    ].includes(target);
  };

  // 멤버별 출근 및 퇴근 시간을 정의하는 객체

  const setScheduleList = (schedules: ScheduleObj) => {
    const memberRecords: MemberRecord = {};

    for (const member of Object.keys(schedules) as FeMember[]) {
      // 멤버의 첫 일정 시간을 출근 시간으로 설정
      const memberSchedules = schedules[member];
      const firstScheduleTime = memberSchedules![0].시간.split(' ~ ')[0];
      const [firstStartHour, firstStartMinute] = firstScheduleTime.split(':').map(Number);
      const firstStart = firstStartHour + firstStartMinute / 60;

      // 첫 일정의 시작 시간에 따른 출퇴근 시간 설정
      const start = Math.floor(firstStart);
      const end = start + 9; // 9시간 후를 퇴근 시간으로 설정

      const memberRecord: ProjectRecord = {};
      let totalT = 0;
      let totalOT = 0;

      memberSchedules?.forEach((schedule) => {
        const { 시간, 일정명 } = schedule;
        const [startTime, endTime] = 시간.split(' ~ ').map((time) => {
          const [hour, minute] = time.split(':').map(Number);
          return hour + minute / 60;
        });

        let T = 0;
        let OT = 0;

        // 정규 근무 시간 내에서 시작과 끝 처리
        if (startTime < end && endTime > start) {
          T = Math.min(end, endTime) - Math.max(start, startTime);
        }

        // 퇴근 시간 이후에 끝나는 일정 처리
        if (endTime > end) {
          OT += endTime - Math.max(end, startTime);
        }

        // 출근 시간 전에 시작하는 일정 처리
        if (startTime < start) {
          OT += start - startTime;
          T -= start - startTime; // 이미 추가된 정규 근무 시간에서 제외
        }

        // 결과를 프로젝트명으로 분류
        const projectName = 일정명.match(/\[(.*?)\]/)?.[1] || '';
        const taskName = 일정명.replace(/\[.*?\]\s*/, '');

        if (!memberRecord[projectName]) {
          memberRecord[projectName] = {
            T: 0,
            OT: 0,
            tasks: [],
          };
        }

        // 시간 추가
        memberRecord[projectName].T += Math.max(0, T); // 음수가 되지 않도록 처리
        memberRecord[projectName].OT += OT;

        // tasks에 중복 없이 추가
        if (
          (OT > 0 || ['FE', '전사', '전사공통', '기타'].includes(projectName)) &&
          !memberRecord[projectName].tasks.includes(taskName)
        ) {
          memberRecord[projectName].tasks.push(taskName);
        }

        // 합계 계산
        totalT += T;
        totalOT += OT;
      });

      // 합계을 멤버 레코드에 추가
      memberRecord['합계'] = {
        T: totalT,
        OT: totalOT,
        tasks: [], // 일정명은 포함하지 않음
      };

      memberRecords[member] = memberRecord;
    }

    scheduleList.value = memberRecords;
  };

  // #region api
  /** 주간일정 가져오기 */
  const getWeekSchedule = async (week: 'pre' | 'cur' | 'nex' = 'cur') => {
    try {
      fetch.start('getWeekSchedule');

      const schedules = await scheduleService.getWeekSchedule(week);

      const result: ScheduleObj = {};
      schedules.forEach((schedule) => {
        const targets: string[] = schedule.일정대상자.split(', ');
        targets.forEach((target) => {
          // target이 FeMember 타입인지 확인
          if (isFeMember(target)) {
            // 대상자 이름을 키로 사용하여 객체 초기화
            if (!result[target]) {
              result[target] = [];
            }
            // 대상자의 일정 정보 추가
            result[target]?.push({
              시간: schedule.시간,
              일자: schedule.일자,
              일정명: schedule.일정명,
            });
          }
        });
      });
      setScheduleList(result);

      fetch.isSuccess('getWeekSchedule');
    } catch (error) {
      fetch.isError('getWeekSchedule');

      console.error(error);

      throw error;
    }
  };
  // #endregion

  const handleWeek = async (week: 'pre' | 'cur' | 'nex' = 'cur') => {
    switch (week) {
      case 'pre':
        startDate.value = dayjs(startDate.value).subtract(7, 'day').format('YYYY-MM-DD');
        endDate.value = dayjs(endDate.value).subtract(7, 'day').format('YYYY-MM-DD');
        break;
      case 'cur':
        startDate.value = useCalculateWeek().startDate;
        endDate.value = useCalculateWeek().endDate;
        break;
      case 'nex':
        startDate.value = dayjs(startDate.value).add(7, 'day').format('YYYY-MM-DD');
        endDate.value = dayjs(endDate.value).add(7, 'day').format('YYYY-MM-DD');
        break;

      default:
        break;
    }

    await getWeekSchedule(week);
  };

  const init = async () => {
    await getWeekSchedule();
  };

  onMounted(() => {
    init();
  });

  return {
    startDate,
    endDate,

    fetches,
    isLoading,
    isError,
    checkStatus,

    scheduleList,
    handleWeek,
  };
}
