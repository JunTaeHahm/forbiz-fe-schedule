import { MemberRecord } from '@/types/schedule.types';
import { PropType, toRefs } from 'vue';

interface Props {
  schedules: MemberRecord;
}

const props = {
  schedules: {
    type: [] as PropType<Props['schedules']>,
    default: () => [],
  },
};

export default function hTableComposable(props: Props) {
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

  return { copySchedule };
}

export { props as hTableProps };
