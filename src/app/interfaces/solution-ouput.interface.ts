export interface SolutionOutput {
  Assignments: CourseOutput[];
  Cost: number;
}

export interface CourseOutput {
  Course: string;
  Period: number;
  Room: string;
}
