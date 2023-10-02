import {
  GetScheduleDetailPayload,
  GetScheduleDetailResponse,
  GetWeekSchedulePayload,
  GetWeekScheduleResponse,
} from '@/types/schedule.types';
import axios from 'axios';

const isDevelopment = import.meta.env.VITE_APP_NODE_ENV !== 'production';

export default class ScheduleService {
  private baseUrl: string;

  constructor() {
    if (isDevelopment) {
      this.baseUrl = 'http://localhost:3000'; // 개발
    } else {
      this.baseUrl = 'large-cassandre-juntaehahm.koyeb.app'; // 배포
    }
  }

  /** 주간 일정 가져오기 */
  public async getWeekSchedule(payload: GetWeekSchedulePayload) {
    try {
      const result = await axios.post<GetWeekScheduleResponse>(`${this.baseUrl}/api/getWeekSchedule`, payload);

      return result.data;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  /** 일정 상세 데이터 가져오기 */
  public async getDetailSchedule(payload: GetScheduleDetailPayload) {
    try {
      const result = await axios.post<GetScheduleDetailResponse>(`${this.baseUrl}/api/getDetailSchedule`, payload);
      console.log('result: ', result);

      return result.data;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
