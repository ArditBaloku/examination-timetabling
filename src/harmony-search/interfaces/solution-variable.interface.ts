import { Room } from 'src/parser/interfaces';

export interface SolutionVariable {
  id: string;
  period: number;
  rooms: Room[];
}
