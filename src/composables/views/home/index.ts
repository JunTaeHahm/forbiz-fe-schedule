import { PropType, computed, onMounted, reactive, ref } from 'vue';
import ScheduleService from '@/services/schedules';
import { FbMember, ProjectRecord, MemberRecord, ScheduleObj } from '@/types/schedule.types';
import { useCalculateWeek } from '@/utils/date';
import dayjs from 'dayjs';

interface Props {
  part: string | string[];
}

const props = {
  part: {
    type: String as PropType<Props['part']>,
    default: 'fe',
  },
};

export default function homeComposable(props: Props) {
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

  const isFbMember = (target: string): target is FbMember => {
    return [
      /* FE */
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
      /* QA */
      '이상욱',
      '이성길',
      '신조아',
      '김예진',
      '이준호',
    ].includes(target);
  };

  // 멤버별 출퇴근 시간을 설정하는 객체
  const memberWorkHours = {
    /* FE */
    김석진: { start: 9, end: 18 },
    김승우: { start: 9, end: 18 },
    김태이: { start: 9, end: 18 },
    윤보라: { start: 9.5, end: 18.5 },
    임지원: { start: 9, end: 18 },
    전동엽: { start: 9.5, end: 18.5 },
    전민주: { start: 9, end: 18 },
    정수범: { start: 9.5, end: 18.5 },
    정재원: { start: 9, end: 18 },
    함준태: { start: 9, end: 18 },
    /* QA */
    이상욱: { start: 9, end: 18 },
    이성길: { start: 9.5, end: 18.5 },
    신조아: { start: 10, end: 19 },
    김예진: { start: 9.5, end: 18.5 },
    이준호: { start: 9.5, end: 18.5 },
  };

  const setScheduleList = (schedules: ScheduleObj) => {
    const memberRecords: MemberRecord = {};

    for (const member of Object.keys(schedules) as FbMember[]) {
      const memberSchedules = schedules[member];
      const workHours = memberWorkHours[member]; // 개별 멤버의 출퇴근 시간

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
        if (startTime < workHours.end && endTime > workHours.start) {
          T = Math.min(workHours.end, endTime) - Math.max(workHours.start, startTime);
        }

        // 퇴근 시간 이후에 끝나는 일정 처리
        if (endTime > workHours.end) {
          OT = endTime - Math.max(workHours.end, startTime);
        }

        // 출근 시간 전에 시작하는 일정 처리
        if (startTime < workHours.start) {
          OT += workHours.start - startTime;
          T -= workHours.start - startTime; // 이미 추가된 정규 근무 시간에서 제외
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
          (OT > 0 || ['FE', 'QA', '전사', '전사공통', '기타'].includes(projectName)) &&
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
      const schedules = await scheduleService.getWeekSchedule(week, props.part);

      const result: ScheduleObj = {};
      schedules.forEach((schedule) => {
        const targets: string[] = schedule.일정대상자.split(', ');
        targets.forEach((target) => {
          // target이 FbMember 타입인지 확인
          if (isFbMember(target)) {
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
    console.log('init');
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

export { props as homeProps };

export type { Props as HomeProps };
