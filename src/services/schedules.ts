import { GetWeekScheduleResponse } from '@/types/schedule.types';
import axios from 'axios';

const isDevelopment = import.meta.env.VITE_APP_NODE_ENV !== 'production';

export default class ScheduleService {
  private baseUrl: string;

  constructor() {
    if (isDevelopment) {
      this.baseUrl = 'http://localhost:15000'; // 개발
    } else {
      this.baseUrl = 'http://192.168.1.49:15000'; // 배포
    }
  }

  /** 주간 일정 가져오기 */
  public async getWeekSchedule(week: 'pre' | 'cur' | 'nex' = 'cur', part: string | string[] = 'fe') {
    try {
      const result = await axios.post<GetWeekScheduleResponse>(`${this.baseUrl}/api/getWeekSchedule`, {
        week,
        part,
      });

      return result.data;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
