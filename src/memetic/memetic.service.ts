import { Injectable } from '@nestjs/common';
import { Solution } from 'src/app/interfaces';
import { HarmonySearchService } from 'src/harmony-search/harmony-search.service';
import { MetaheuristicsService } from 'src/metaheuristics/metaheuristics.service';
import { SimulatedAnnealingService } from 'src/simulated-annealing/simulated-annealing.service';

@Injectable()
export class MemeticService {
  private harmonyMemory: Solution[] = [];

  constructor(
    private readonly harmonySearchService: HarmonySearchService,
    private readonly simulatedAnnealingService: SimulatedAnnealingService,
    private readonly metaheuristicsService: MetaheuristicsService,
  ) {}

  run(): void {
    this.harmonyMemory = this.harmonySearchService.createHarmonyMemory();
    let bestFitness = this.harmonyMemory[0].fitness;
    let worstFitness =
      this.harmonyMemory[this.harmonyMemory.length - 1].fitness;

    while (true) {
      const solutionVector =
        this.harmonySearchService.createVectorFromHarmonyMemory(
          this.harmonyMemory,
        );
      const fitness =
        this.metaheuristicsService.calculateFitness(solutionVector);

      if (fitness < this.harmonyMemory[this.harmonyMemory.length - 1].fitness) {
        this.harmonyMemory[this.harmonyMemory.length - 1] = {
          solutionVector,
          fitness,
        };
      }

      for (let i = 0; i < this.harmonyMemory.length; i++) {
        let t = 1.0;
        let solution = this.harmonyMemory[i].solutionVector;
        let fitness = this.harmonyMemory[i].fitness;
        let bestFitness = fitness;
        let bestSolution = solution;

        for (let j = 0; j < 100; j++) {
          const neighbour =
            this.simulatedAnnealingService.tweakSolution(solution);
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
            bestSolution = solution;
            bestFitness = fitness;
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
            return;
          }

          t = t / (1 + 0.001 * t);
        }

        this.harmonyMemory[i] = {
          solutionVector: bestSolution,
          fitness: bestFitness,
        };
      }

      this.harmonyMemory.sort((a, b) => a.fitness - b.fitness);

      if (this.harmonyMemory[0].fitness === 0) {
        console.log('Solution found');
        this.metaheuristicsService.logSolutionVector(this.harmonyMemory[0]);
        this.metaheuristicsService.saveSolution(this.harmonyMemory[0]);
        return;
      }

      if (
        this.harmonyMemory[0].fitness < bestFitness ||
        this.harmonyMemory[this.harmonyMemory.length - 1].fitness < worstFitness
      ) {
        bestFitness = this.harmonyMemory[0].fitness;
        worstFitness =
          this.harmonyMemory[this.harmonyMemory.length - 1].fitness;
        console.log(
          `Best fitness: ${bestFitness}. Worst fitness: ${worstFitness}`,
        );
      }
    }
  }
}
