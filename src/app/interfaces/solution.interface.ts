import { SolutionVariable } from '.';

export interface Solution {
  solutionVector: SolutionVariable[];
  fitness: number;
}
