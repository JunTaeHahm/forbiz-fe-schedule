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

type Schedule = {
  시간: string;
  일자: string;
  일정명: string;
};

type TimeRecord = {
  T: number; // 정규 근무 시간
  OT: number; // 초과 근무 시간
  tasks: string[]; // 수행한 태스크 목록
};

type ProjectRecord = { [projectName: string]: TimeRecord };

type MemberRecord = { [memberName in FeMember]?: ProjectRecord };

type WorkRecords = {
  [projectName: string]: ProjectRecord;
};

type ScheduleObj = {
  [K in FeMember]?: Schedule[];
};

interface GetWeekScheduleItem {
  시간: string;
  일자: string;
  일정명: string;
  일정대상자: string;
}

type GetWeekScheduleResponse = GetWeekScheduleItem[];

export type {
  FeMember,
  Schedule,
  ProjectRecord,
  WorkRecords,
  MemberRecord,
  ScheduleObj,
  GetWeekScheduleResponse,
  GetWeekScheduleItem,
};
