import { Course } from './course.interface';
import { Curriculum } from './curriculum.interface';
import { Room } from './room.interface';

export interface Instance {
  Name: string;
  Courses: Course[];
  Curricula: Curriculum[];
  Periods: number;
  PrimaryPrimaryDistance: number;
  PrimarySecondaryDistance: number;
  Rooms: Room[];
  SlotsPerDay: number;
  Teachers: string[];
}
