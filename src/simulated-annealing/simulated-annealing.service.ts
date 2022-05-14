import { Injectable } from '@nestjs/common';
import { SolutionVariable } from 'src/app/interfaces';
import { MetaheuristicsService } from 'src/metaheuristics/metaheuristics.service';

@Injectable()
export class SimulatedAnnealingService {
  constructor(private readonly metaheuristicsService: MetaheuristicsService) {}

  run(): void {
    let t = 1.0;
    let solution = this.metaheuristicsService.createRandomSolutionVector();
    let fitness = this.metaheuristicsService.calculateFitness(solution);
    let bestFitness = fitness;

    this.metaheuristicsService.logSolutionVector({
      solutionVector: solution,
      fitness,
    });

    while (true) {
      const neighbour = this.tweakSolution(solution);
      const neighbourFitness =
        this.metaheuristicsService.calculateFitness(neighbour);

      if (
        neighbourFitness < fitness ||
        Math.random() < Math.exp((neighbourFitness - fitness) / (100 * t))
      ) {
        solution = neighbour;
        fitness = neighbourFitness;
      }

      if (fitness < bestFitness) {
        bestFitness = fitness;
        console.log('new best fitness', bestFitness);
      }

      if (fitness === 0) {
        this.metaheuristicsService.logSolutionVector({
          solutionVector: solution,
          fitness: fitness,
        });
        this.metaheuristicsService.saveSolution({
          solutionVector: solution,
          fitness: fitness,
        });
        break;
      }

      t = t / (1 + 0.001 * t);
    }
  }

  tweakSolution(solution: SolutionVariable[]) {
    const solutionCopy: SolutionVariable[] = JSON.parse(
      JSON.stringify(solution),
    );

    const varsWithPeriodConflict = solutionCopy.filter(
      (x) => x.hasPeriodConflict,
    );

    if (varsWithPeriodConflict.length) {
      const index = Math.floor(Math.random() * varsWithPeriodConflict.length);
      const variable = varsWithPeriodConflict[index];
      variable.period = this.metaheuristicsService.getRandomPeriod();
      return solutionCopy;
    }

    const varsWithRoomConflict = solutionCopy.filter((x) => x.hasRoomConflict);

    if (varsWithRoomConflict.length) {
      const index = Math.floor(Math.random() * varsWithRoomConflict.length);
      const variable = varsWithRoomConflict[index];
      variable.rooms = this.metaheuristicsService.getRandomRooms(
        variable.rooms[0].Type,
        variable.rooms.length,
      );
      return solutionCopy;
    }

    const varsWithSoftConflict = solutionCopy.filter((x) => x.hasSoftConflict);

    if (varsWithSoftConflict.length) {
      const index = Math.floor(Math.random() * varsWithSoftConflict.length);
      const variable = varsWithSoftConflict[index];
      variable.period = this.metaheuristicsService.getRandomPeriod();
      return solutionCopy;
    }

    return solutionCopy;
  }
}
