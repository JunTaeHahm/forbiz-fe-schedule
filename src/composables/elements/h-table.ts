import { FeMember, Schedule, ScheduleResult } from '@/types/schedule.types';
import { PropType, toRefs } from 'vue';

interface Props {
  members: FeMember[];
  schedules: Schedule[];
}

const props = {
  members: {
    type: [] as PropType<Props['members']>,
    default: () => [],
  },
  schedules: {
    type: [] as PropType<Props['schedules']>,
    default: () => [],
  },
};

export default function hTableComposable(props: Props) {
  const { members, schedules } = toRefs(props);

  const copySchedule = async ($event: Event) => {
    const text = ($event.target as HTMLElement).parentElement?.innerText;

    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        window.alert('복사되었습니다.');
      } catch (err) {
        console.error('Failed to copy text: ', err);
        window.alert('복사에 실패했습니다.');
      }
    }
  };

  const shouldShowTitle = (projectName: string, data: ScheduleResult) => {
    return data.overTime || ['[FE]', '[전사]', '[전사공통]'].includes(projectName);
  };

  return { members, schedules, copySchedule, shouldShowTitle };
}

export { props as hTableProps };
