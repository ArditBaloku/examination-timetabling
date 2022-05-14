import { Injectable } from '@nestjs/common';
import { InstanceContainer } from 'src/instance-container/instance-container.service';
import { Solution, SolutionVariable } from '../app/interfaces';
import { MetaheuristicsService } from 'src/metaheuristics/metaheuristics.service';

@Injectable()
export class HarmonySearchService {
  private readonly HMCR = 0.9;
  private readonly PAR_PERIOD = 0.1;
  private readonly PAR_ROOMS = 0.1;
  private readonly HMS = 10;
  private harmonyMemory: Solution[] = [];

  constructor(
    private readonly instanceContainer: InstanceContainer,
    private readonly metaheuristicsService: MetaheuristicsService,
  ) {}

  run(): void {
    this.harmonyMemory = this.createHarmonyMemory();
    let bestFitness = this.harmonyMemory[0].fitness;
    let worstFitness =
      this.harmonyMemory[this.harmonyMemory.length - 1].fitness;

    while (true) {
      const solutionVector = this.createVectorFromHarmonyMemory(
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

      this.harmonyMemory.sort((a, b) => a.fitness - b.fitness);

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

      if (this.harmonyMemory[0].fitness === 0) {
        console.log('Solution found');
        this.metaheuristicsService.logSolutionVector(this.harmonyMemory[0]);
        this.metaheuristicsService.saveSolution(this.harmonyMemory[0]);
        break;
      }
    }
  }

  createHarmonyMemory(): Solution[] {
    const hm: Solution[] = [];

    for (let i = 0; i < this.HMS; i++) {
      const solutionVector =
        this.metaheuristicsService.createRandomSolutionVector();
      const fitness =
        this.metaheuristicsService.calculateFitness(solutionVector);
      hm.push({
        solutionVector,
        fitness,
      });
    }

    hm.sort((a, b) => a.fitness - b.fitness);

    this.logHarmonyMemory(hm);

    return hm;
  }

  private logHarmonyMemory(hm: Solution[]): void {
    hm.forEach((x) => this.metaheuristicsService.logSolutionVector(x));
  }

  createVectorFromHarmonyMemory(hm: Solution[]): SolutionVariable[] {
    const solutionVector: SolutionVariable[] = [];

    const instance = this.instanceContainer.getInstance();

    for (let i = 0; i < instance.Courses.length; i++) {
      const course = instance.Courses[i];
      let variable: SolutionVariable = {
        id: course.Course,
        period: 0,
        rooms: [],
      };

      if (Math.random() < this.HMCR) {
        const randomIndex = Math.floor(Math.random() * hm.length);
        const randomSolution = hm[randomIndex];
        variable.period = randomSolution.solutionVector[i].period;
        variable.rooms = randomSolution.solutionVector[i].rooms;

        if (Math.random() < this.PAR_PERIOD) {
          const lowerBound = Math.max(0, variable.period - 3);
          const upperBound = Math.min(
            instance.Periods - 1,
            variable.period + 3,
          );

          variable.period = Math.floor(
            Math.random() * (upperBound - lowerBound + 1) + lowerBound,
          );
        }

        if (Math.random() < this.PAR_ROOMS) {
          let possibleRooms = instance.Rooms.filter(
            (x) =>
              x.Type === course.RoomsRequested.Type &&
              !variable.rooms.some((y) => x.Room === y.Room),
          );

          for (let j = 0; j < course.RoomsRequested.Number; j++) {
            if (!possibleRooms.length) break;

            const roomIndex = Math.floor(Math.random() * possibleRooms.length);
            const room = possibleRooms[roomIndex];
            possibleRooms = possibleRooms.filter((x) => x.Room !== room.Room);
            variable.rooms.shift();
            variable.rooms.push(room);
          }
        }
      } else {
        variable =
          this.metaheuristicsService.createRandomSolutionVariable(course);
      }

      solutionVector.push(variable);
    }

    return solutionVector;
  }
}
