import { MemberRecord } from '@/types/schedule.types';
import { PropType } from 'vue';

interface Props {
  schedules: MemberRecord;
}

const props = {
  schedules: {
    type: [] as PropType<Props['schedules']>,
    default: () => [],
  },
};

export default function hTableComposable() {
  const copySchedule = async ($event: Event) => {
    const text = ($event.target as HTMLElement).parentElement?.innerText;

    if (text) {
      if (navigator.clipboard) {
        // 보안 환경에서 navigator.clipboard 사용
        try {
          await navigator.clipboard.writeText(text);
          window.alert('복사되었습니다.');
        } catch (err) {
          console.error('Failed to copy text: ', err);
          window.alert('복사에 실패했습니다.');
        }
      } else {
        // 비보안 환경에서 document.execCommand 사용
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();

        try {
          const successful = document.execCommand('copy');
          if (successful) {
            console.log('Text copied to clipboard');
            window.alert('복사되었습니다.');
          } else {
            console.log('Failed to copy text');
            window.alert('복사에 실패했습니다.');
          }
        } catch (err) {
          console.error('Error in copying text: ', err);
          window.alert('복사에 실패했습니다.');
        }

        document.body.removeChild(textarea);
      }
    }
  };

  return { copySchedule };
}

export { props as hTableProps };
