type FeMember = '전동엽' | '김승우' | '임지원' | '전민주' | '정수범' | '김석진' | '김태이' | '윤보라' | '정재원';

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
  detailYn: 'Y' | 'N';
  schSeq: string;
  schmSeq: string;
}

interface GetScheduleDetailItem {
  mentionEmpList: { deptSeq: string; compSeq: string; empSeq: string }[];
  schAlarmList: {
    alarmType: string;
    alarmRealDate: string;
    alarmTimeDiv: string;
    alarmUnitValue: string;
    alarmTimeNm: string;
    alarmTimeUnit: string;
  }[];
  event: {
    timelineYn: 'Y' | 'N';
    eventSubType: string;
    mailYn: 'Y' | 'N';
    data: {
      schmSeq: string;
      endDate: string;
      contents: string;
      schSeq: string;
      createSeq: string;
      gbnCode: string;
      title: string;
      startDate: string;
    };
    recvEmpBulkList: [];
    smsYn: 'Y' | 'N';
    pushYn: 'Y' | 'N';
    eventType: string;
    url: string;
    recvEmpList: [];
    recvMentionEmpList: [];
    portalYn: 'Y' | 'N';
    talkYn: 'Y' | 'N';
    alertYn: 'Y' | 'N';
    recvEmpBulk: string;
  };
  schUserList: {
    deptName: string;
    orgName: 'F.E';
    loginId: string;
    compName: string;
    groupSeq: 'forbizkorea';
    dutyName: string;
    positionName: string;
    orgType: string;
    deptSeq: string;
    compSeq: string;
    bizSeq: string;
    useYn: 'Y' | 'N';
    userType: '10' | '20';
    orgSeq: string;
    seq: string;
  }[];
}
interface GetScheduleDetailResponse {
  schmSeq: string;
  mentionEmpList: GetScheduleDetailItem['mentionEmpList'];
  moduleGbnCode: string;
  endDate: string;
  createLoginId: string;
  resList: [];
  schSeq: string;
  calTitle: string;
  resListForDel: string;
  gbnCode: string;
  noteList: string;
  repeatByDay: string;
  schAlarmList: GetScheduleDetailItem['schAlarmList'];
  schPlace: string;
  groupSeq: string;
  schReferList: [];
  gbnName: string;
  schMapLat: string;
  commentType: string;
  schTitle: string;
  event: GetScheduleDetailItem['event'];
  commentCnt: string;
  mcalSeq: string;
  fileList: [];
  createDate: string;
  schUserList: GetScheduleDetailItem['schUserList'];
  empUniqGroup: string;
  repeatType: string;
  createSeq: string;
  repeatEndDay: string;
  schMapLng: string;
  createWorkStatus: string;
  createDeptSeq: string;
  attDivCode: 'Y' | 'N';
  moduleSeq: string;
  delYn: 'Y' | 'N';
  placeFileList: [];
  schInviterList: [];
  contents: string;
  compSeq: string;
  gbnSeq: string;
  schGbnCode: string;
  createCompSeq: string;
  placeMapData: string;
  alldayYn: 'Y' | 'N';
  startDate: string;
  createName: FeMember;
  inviterType: string;
}
export type {
  GetWeekSchedulePayload,
  GetWeekScheduleItem,
  GetWeekScheduleResponse,
  GetScheduleDetailPayload,
  GetScheduleDetailItem,
  GetScheduleDetailResponse,
};
