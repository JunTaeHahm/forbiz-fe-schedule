type FeMember =
  | '김석진'
  | '김승우'
  | '김태이'
  | '윤보라'
  | '임지원'
  | '전동엽'
  | '전민주'
  | '정수범'
  | '정재원'
  | '함준태';

type WeekSchedule = Pick<GetWeekScheduleItem, 'startDate' | 'endDate' | 'createName' | 'schTitle' | 'schSeq'>;

type ShareSchedule = Pick<GetWeekScheduleItem, 'startDate' | 'endDate' | 'createName' | 'schSeq'>;

interface ScheduleResult {
  time: number;
  overTime: number;
  title: Set<string>;
}

interface GetWeekSchedulePayload {
  calType: 'M';
  endDate: string;
  mcalSeq: '125';
  mySchYn: 'N';
  startDate: string;
}

interface GetWeekScheduleItem {
  schmSeq: string;
  resYn: string;
  partCount: number;
  endDate: string; // 종료일
  schSeq: string; // 일정 고유 번호
  calTitle: string;
  gbnCode: string;
  schPlace: string;
  partName: FeMember;
  delYn: string;
  joinYn: string;
  createDateOrder: string;
  gbnName: string;
  calColor: string;
  calRwGbn: string;
  gbnSeq: string;
  schTitle: string; // 일정 제목
  schGbnCode: string;
  alldayYn: string;
  mcalSeq: string;
  startDate: string; // 시작일
  createName: FeMember; // 작성자
  statusCode: string;
}

type GetWeekScheduleResponse = GetWeekScheduleItem[];

interface GetScheduleDetailPayload {
  detailYn: 'Y';
  schSeq: string[];
  schmSeq: string[];
}

interface GetScheduleDetailItem {
  createName: FeMember;
  startDate: string;
  endDate: string;
  schTitle: string;
  userList: FeMember[];
}
type GetScheduleDetailResponse = GetScheduleDetailItem[];

export type {
  FeMember,
  WeekSchedule,
  ShareSchedule,
  ScheduleResult,
  GetWeekSchedulePayload,
  GetWeekScheduleItem,
  GetWeekScheduleResponse,
  GetScheduleDetailPayload,
  GetScheduleDetailItem,
  GetScheduleDetailResponse,
};
