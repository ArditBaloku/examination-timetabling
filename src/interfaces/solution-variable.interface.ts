import { Room } from 'src/instance-container/interfaces';

export interface SolutionVariable {
  id: string;
  period: number;
  rooms: Room[];
  hasPeriodConflict?: boolean;
  hasRoomConflict?: boolean;
  hasSoftConflict?: boolean;
}
