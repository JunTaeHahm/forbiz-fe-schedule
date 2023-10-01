interface Time {
  time: number;
  hasOverTime: boolean;
  overTime: number;
}

interface WorkTime {
  startH: number;
  startM: number;
  endH: number;
  endM: number;
}

export type { Time, WorkTime };
