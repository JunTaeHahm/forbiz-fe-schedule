import { Ref, computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { WORK_TIME } from '@/configs/workTime.config';
import ScheduleService from '@/services/schedules';
import { FeMember, GetScheduleDetailPayload, Schedule, ShareSchedule, WeekSchedule } from '@/types/schedule.types';
import { useCalculateWeek, formatDate } from '@/utils/date';
import { useCalculateTime, isPublicEndTime, isPublicStartTime } from '@/utils/time';
import { getProjectName } from '@/utils/regexp';
import dayjs from 'dayjs';

export default function homeComposable() {
  // #region 이번주 시작일과 종료일
  const startDate = ref(useCalculateWeek().startDate);
  const endDate = ref(useCalculateWeek().endDate);

  // #endregion

  // #region fetches
  type FetchKey = 'getWeekSchedule' | 'weekScheduleList' | 'getDetailSchedule';

  type FetchState = 'wait' | 'ing' | 'success' | 'error';

  type Fetches = Record<FetchKey, FetchState>;

  const fetches = reactive<Fetches>({
    getWeekSchedule: 'wait',
    weekScheduleList: 'wait',
    getDetailSchedule: 'wait',
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
    return (
      fetches.getDetailSchedule === 'ing' ||
      fetches.getDetailSchedule === 'wait' ||
      fetches.getWeekSchedule === 'ing' ||
      fetches.getWeekSchedule === 'wait' ||
      fetches.weekScheduleList === 'ing' ||
      fetches.weekScheduleList === 'wait'
    );
  });

  const isError = computed(() => {
    return (
      fetches.getDetailSchedule === 'error' ||
      fetches.getWeekSchedule === 'error' ||
      fetches.weekScheduleList === 'error'
    );
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

  // #region 일정/멤버 관련 변수
  // 주간/공유 일정 및 코드 리스트
  const weekScheduleList = ref<WeekSchedule[]>([]);
  const shareScheduleList = ref<ShareSchedule[]>([]);
  const schSeqList = ref<GetScheduleDetailPayload['schSeq']>([]);

  // 멤버 리스트
  const members: Ref<FeMember[]> = computed(() => {
    // if (weekScheduleList.value.length !== 0) {
    //   return [...new Set(weekScheduleList.value.map((schedule) => schedule.createName))].sort();
    // }

    return ['김석진', '김승우', '김태이', '윤보라', '임지원', '전동엽', '전민주', '정수범', '정재원', '함준태'];
  });
  // #endregion

  // #region 주간 일정
  const schedules = ref<Schedule[]>(Array(10).fill({}));

  const isCompanySchedule = ref<boolean>(false);
  const isFeSchedule = ref<boolean>(false);

  watch(weekScheduleList, (newValue) => {
    fetch.start('weekScheduleList');

    schedules.value = members.value.map((name) => {
      // 일정 작성자가 FE멤버와 동일한 일정만 필터링
      const memberSchedules = newValue.filter((schedule) => schedule.createName === name);

      // 빈 객체 생성
      const result: Schedule = {};

      memberSchedules.forEach((schedule, i, arr) => {
        // 멤버명, 프로젝트명, 일정제목
        const memberName: FeMember = schedule.createName;
        const { projectName, title } = getProjectName(schedule.schTitle);

        // 전사일정, FE일정 여부
        isCompanySchedule.value = projectName === '[전사]' || projectName === '[전사공통]';
        isFeSchedule.value = projectName === '[FE]';

        // 일정 시간, OT여부, OT시간 가져오기
        const { time, hasOverTime, overTime } = useCalculateTime(schedule);

        // 현재 일정의 종료시간과, 다음일정의 시작시간
        const endTime = schedule?.endDate;
        const startTime = arr[i + 1]?.startDate;

        // 공통일정(점심시간 및 출퇴근시간) 여부
        let isPublicSchedule: boolean = false;

        // 이번 일정의 종료시간이나 다음 일정의 시작시간이 공통일정에 해당되는 경우
        if (isPublicStartTime(endTime, WORK_TIME[memberName]) || isPublicEndTime(startTime, WORK_TIME[memberName])) {
          isPublicSchedule = true;
        }

        // 이번 일정의 종료시간과 다음 일정의 시작시간 사이에 시간이 비어있다면
        // 다른 멤버가 공유일정으로 작성했다고 판단하고 공유일정 검색용 리스트에 추가
        if (!isPublicSchedule && endTime !== startTime) {
          shareScheduleList.value.push({
            startDate: startTime,
            endDate: endTime,
            createName: schedule.createName,
            schSeq: schedule.schSeq,
          });
        }

        if (hasOverTime) {
          // 일정이 OT에 포함되는 경우
          if (!result[projectName]) {
            // 일치하는 프로젝트명 없을 경우 객체 초기화
            result[projectName] = { time: time - overTime, overTime, title: new Set([title]) };
          }

          result[projectName].time! += time - overTime; // OT는 따로 계산하므로 전체 시간에서 OT를 뺀 시간만 추가
          result[projectName].overTime! += overTime; // OT시간 추가
          result[projectName].title?.add(title); // 일정 내용 추가
        } else {
          // 공유일정이 근무시간 내에 포함되는 경우
          if (!result[projectName]) {
            // 일치하는 프로젝트명 없을 경우 객체 초기화
            result[projectName] = { time: 0, overTime: 0, title: new Set() };
          }

          result[projectName].time! += time; // 일정 시간만 추가
        }

        // FE일정 내용 추가
        if (isFeSchedule.value) result[projectName].title?.add(title);
        if (isCompanySchedule.value) {
          result[projectName].title?.add(title);
        }
      });

      return result;
    });

    // 멤버 리스트 길이와 일정 리스트 길이가 다르거나 일정이 없을 경우 error
    if (schedules.value.length !== members.value.length || !schedules.value) {
      fetch.isError('weekScheduleList');
    }

    // 전사일정을 가지고있는 인덱스 찾기
    const companyScheduleStrings = ['[전사]', '[전사공통]'];
    const companySchedulesIndex = schedules.value.findIndex((schedule) =>
      Object.keys(schedule).some((key) => companyScheduleStrings.includes(key)),
    );

    // 멤버 중 전사일정을 가지고 있을 경우 모든 멤버에게 전사일정 추가
    if (companySchedulesIndex !== -1) {
      const matchedKeys = Object.keys(schedules.value[companySchedulesIndex]).filter((key) =>
        companyScheduleStrings.includes(key),
      );

      schedules.value = schedules.value.map((schedule) => {
        matchedKeys.forEach((key) => {
          schedule[key] = schedules.value[companySchedulesIndex][key];
        });

        return schedule;
      });
    }

    fetch.isSuccess('weekScheduleList');
  });
  // #endregion

  // #region
  /** 새로고침 */
  const handleRefresh = () => {
    window.location.reload();
  };

  /** 지난주 검색 */
  const handlePrevWeek = () => {
    startDate.value = dayjs(startDate.value).subtract(7, 'day').format('YYYY-MM-DD');
    endDate.value = dayjs(endDate.value).subtract(7, 'day').format('YYYY-MM-DD');

    getWeekSchedule();
  };

  /** 이번주 검색 */
  const handleThisWeek = () => {
    startDate.value = useCalculateWeek().startDate;
    endDate.value = useCalculateWeek().endDate;

    getWeekSchedule();
  };

  /** 다음주 검색 */
  const handleNextWeek = () => {
    startDate.value = dayjs(startDate.value).add(7, 'day').format('YYYY-MM-DD');
    endDate.value = dayjs(endDate.value).add(7, 'day').format('YYYY-MM-DD');

    getWeekSchedule();
  };

  // #endregion

  // #region api
  /** 주간일정 가져오기 */
  const getWeekSchedule = async () => {
    try {
      fetch.start('getWeekSchedule');

      const response = await scheduleService.getWeekSchedule({
        calType: 'M',
        startDate: formatDate(startDate.value, 'api'),
        endDate: formatDate(endDate.value, 'api'),
        mcalSeq: '125',
        mySchYn: 'N',
      });

      weekScheduleList.value = response.map((schedule) => {
        return {
          ...schedule,
          startDate: formatDate(schedule.startDate),
          endDate: formatDate(schedule.endDate),
        };
      });

      fetch.isSuccess('getWeekSchedule');
    } catch (error) {
      fetch.isError('getWeekSchedule');
      console.error(error);
      throw error;
    }
  };

  /** 상세일정 가져오기 */
  const getDetailSchedule = async () => {
    try {
      fetch.start('getDetailSchedule');
      fetch.wait('weekScheduleList');

      const response = await scheduleService.getDetailSchedule({
        detailYn: 'Y',
        schmSeq: schSeqList.value,
        schSeq: schSeqList.value,
      });

      fetch.isSuccess('getDetailSchedule');
      fetch.isSuccess('weekScheduleList');

      return response;
    } catch (error) {
      fetch.isError('getDetailSchedule');
      fetch.isError('weekScheduleList');
      console.error(error);
      throw error;
    }
  };
  // #endregion

  // #region 공유일정 있을 경우 일정코드로 상세일정 검색 및 일정에 추가
  const initWatches = () => {
    watch(
      shareScheduleList,
      async (newValue) => {
        // 비어있는 시작/종료시간과 공유일정의 시작/종료시간 필터링해서 공유일정 찾기
        schSeqList.value = weekScheduleList.value
          .filter((sch) => newValue.some((v) => sch.startDate === v.endDate && sch.endDate === v.startDate))
          .map((v) => v.schSeq);

        // 공유일정 없을 경우 return
        if (schSeqList.value.length === 0) {
          fetch.isSuccess('getDetailSchedule');

          return;
        }

        // 상세공유일정 가져오기
        const shareSchedule = await getDetailSchedule();

        shareSchedule.forEach((schedule) => {
          // 작성자를 제외한 공유일정 해당자 리스트 및 인덱스
          const userList = schedule.userList.filter((user) => user !== schedule.createName);
          const userListIndices = userList.map((user) => members.value.indexOf(user));

          // 인덱스 번호에 해당되는 멤버들의 일정에 time, title 추가
          userListIndices.forEach((index) => {
            if (schedules.value[index]) {
              const { projectName, title } = getProjectName(schedule.schTitle, schedule.schTitle);

              // 일정시간, OT여부, OT시간 가져오기
              const { time, hasOverTime, overTime } = useCalculateTime({
                startDate: formatDate(schedule.startDate),
                endDate: formatDate(schedule.endDate),
                createName: members.value[index],
              } as WeekSchedule);

              if (!schedules.value[index][projectName]) {
                schedules.value[index][projectName] = { time: 0, overTime: 0, title: new Set() };
              }

              if (hasOverTime || projectName === '[FE]') {
                // 공유일정이 OT에 포함되는 경우
                schedules.value[index][projectName].time! += time - overTime;
                schedules.value[index][projectName].overTime! += overTime;
                schedules.value[index][projectName].title?.add(title);
              } else {
                // 공유일정이 근무시간 내에 포함되는 경우
                schedules.value[index][projectName].time += time;
              }
            }
          });
        });
      },
      {
        deep: true,
        immediate: true,
      },
    );
  };
  // #endregion

  let intervalId: number | undefined; // 타이머 ID 저장을 위한 변수

  const init = async () => {
    await getWeekSchedule();

    initWatches();
  };

  onMounted(() => {
    init();
  });

  onBeforeUnmount(() => {
    // 컴포넌트 언마운트 시 타이머 해제
    if (intervalId !== undefined) {
      clearInterval(intervalId);
    }
  });

  return {
    startDate,
    endDate,

    fetches,
    isLoading,
    isError,
    checkStatus,

    members,
    schedules,

    handleRefresh,
    handlePrevWeek,
    handleThisWeek,
    handleNextWeek,
  };
}
