import { Injectable } from '@nestjs/common';
import { Course } from 'src/instance-container/interfaces';
import { InstanceContainer } from 'src/instance-container/instance-container.service';
import { Solution, SolutionVariable } from './interfaces';

@Injectable()
export class HarmonySearchService {
  private readonly HMCR = 0.9;
  private readonly PAR_PERIOD = 0.1;
  private readonly PAR_ROOMS = 0.1;
  private readonly HMS = 10;
  private harmonyMemory: Solution[] = [];

  constructor(private readonly instanceContainer: InstanceContainer) {}

  run(): void {
    this.createHarmonyMemory();
    let bestFitness = this.harmonyMemory[0].fitness;
    let worstFitness =
      this.harmonyMemory[this.harmonyMemory.length - 1].fitness;

    while (true) {
      const solutionVector = this.createVectorFromHarmonyMemory();
      const fitness = this.calculateFitness(solutionVector);

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
        this.logSolutionVector(this.harmonyMemory[0]);
        break;
      }
    }
  }

  private createHarmonyMemory(): void {
    for (let i = 0; i < this.HMS; i++) {
      const solutionVector = this.createRandomSolutionVector();
      const fitness = this.calculateFitness(solutionVector);
      this.harmonyMemory.push({
        solutionVector,
        fitness,
      });
    }

    this.harmonyMemory.sort((a, b) => a.fitness - b.fitness);

    this.logHarmonyMemory();
  }

  private logHarmonyMemory(): void {
    this.harmonyMemory.forEach((x) => this.logSolutionVector(x));
  }

  private logSolutionVector(solution: Solution): void {
    const loggableVector = solution.solutionVector.map((x) => {
      return {
        id: x.id,
        period: x.period,
        rooms: x.rooms.map((y) => y.Room),
      };
    });
    console.table(loggableVector);
    console.log('fitness', solution.fitness);
  }

  private createRandomSolutionVector(): SolutionVariable[] {
    const solutionVector: SolutionVariable[] = [];
    const instance = this.instanceContainer.getInstance();

    for (let i = 0; i < instance.Courses.length; i++) {
      const course = instance.Courses[i];
      const variable = this.createRandomSolutionVariable(course);
      solutionVector.push(variable);
    }

    return solutionVector;
  }

  private createVectorFromHarmonyMemory(): SolutionVariable[] {
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
        const randomIndex = Math.floor(
          Math.random() * this.harmonyMemory.length,
        );
        const randomSolution = this.harmonyMemory[randomIndex];
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
        variable = this.createRandomSolutionVariable(course);
      }

      solutionVector.push(variable);
    }

    return solutionVector;
  }

  private createRandomSolutionVariable(course: Course): SolutionVariable {
    const instance = this.instanceContainer.getInstance();
    const variable: SolutionVariable = {
      id: course.Course,
      period: Math.floor(Math.random() * instance.Periods),
      rooms: [],
    };

    let possibleRooms = instance.Rooms.filter(
      (x) => x.Type === course.RoomsRequested.Type,
    );

    for (let j = 0; j < course.RoomsRequested.Number; j++) {
      const roomIndex = Math.floor(Math.random() * possibleRooms.length);
      const room = possibleRooms[roomIndex];
      possibleRooms = possibleRooms.filter((x) => x.Room !== room.Room);
      variable.rooms.push(room);
    }

    return variable;
  }

  private calculateFitness(solutionVector: SolutionVariable[]): number {
    return (
      this.calculateHardConstraints(solutionVector) * 1000 +
      this.calculateSoftConstraints(solutionVector)
    );
  }

  private calculateHardConstraints(solutionVector: SolutionVariable[]): number {
    let hardConstraints = 0;
    const dependencyGraph = this.instanceContainer.getDependencyGraph();

    for (let i = 0; i < solutionVector.length; i++) {
      const variable = solutionVector[i];

      const hardConstraintCourses = dependencyGraph[variable.id].hard;

      hardConstraints += solutionVector.reduce((acc, curr) => {
        if (!hardConstraintCourses.includes(curr.id)) return acc;

        if (curr.period === variable.period) return acc + 1;

        return acc;
      }, 0);

      hardConstraints += solutionVector.reduce((acc, curr) => {
        if (curr.period === variable.period && curr.id !== variable.id)
          for (const room1 of curr.rooms)
            for (const room2 of variable.rooms)
              if (room1.Room === room2.Room) acc += 1;

        return acc;
      }, 0);
    }

    return hardConstraints / 2;
  }

  private calculateSoftConstraints(solutionVector: SolutionVariable[]): number {
    let softConstraints = 0;
    const dependencyGraph = this.instanceContainer.getDependencyGraph();
    const instance = this.instanceContainer.getInstance();

    for (let i = 0; i < solutionVector.length; i++) {
      const variable = solutionVector[i];

      const softPrimaryCourses = dependencyGraph[variable.id].softPrimary;

      softConstraints += solutionVector.reduce((acc, curr) => {
        if (!softPrimaryCourses.includes(curr.id)) return acc;

        if (
          Math.abs(curr.period - variable.period) <
          instance.PrimaryPrimaryDistance
        )
          return acc + 1;

        return acc;
      }, 0);

      const softSecondaryCourses = dependencyGraph[variable.id].softSecondary;

      softConstraints += solutionVector.reduce((acc, curr) => {
        if (!softSecondaryCourses.includes(curr.id)) return acc;

        if (
          Math.abs(curr.period - variable.period) <
          instance.PrimarySecondaryDistance
        )
          return acc + 1;

        return acc;
      }, 0);
    }

    return softConstraints / 2;
  }
}
