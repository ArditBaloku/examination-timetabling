import { Injectable } from '@nestjs/common';
import { InstanceContainer } from 'src/instance-container/instance-container.service';
import { Course, Room } from 'src/instance-container/interfaces';
import { Solution, SolutionVariable } from 'src/app/interfaces';

@Injectable()
export class SimulatedAnnealingService {
  constructor(private readonly instanceContainer: InstanceContainer) {}

  run(): void {
    let t = 1.0;
    let solution = this.createRandomSolutionVector();
    let fitness = this.calculateFitness(solution);
    let bestFitness = fitness;

    this.logSolutionVector({ solutionVector: solution, fitness });

    while (true) {
      const neighbour = this.tweakSolution(solution);
      const neighbourFitness = this.calculateFitness(neighbour);

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
        this.logSolutionVector({
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
      variable.period = this.getRandomPeriod();
      return solutionCopy;
    }

    const varsWithRoomConflict = solutionCopy.filter((x) => x.hasRoomConflict);

    if (varsWithRoomConflict.length) {
      const index = Math.floor(Math.random() * varsWithRoomConflict.length);
      const variable = varsWithRoomConflict[index];
      variable.rooms = this.getRandomRooms(
        variable.rooms[0].Type,
        variable.rooms.length,
      );
      return solutionCopy;
    }

    const varsWithSoftConflict = solutionCopy.filter((x) => x.hasSoftConflict);

    if (varsWithSoftConflict.length) {
      const index = Math.floor(Math.random() * varsWithSoftConflict.length);
      const variable = varsWithSoftConflict[index];
      variable.period = this.getRandomPeriod();
      return solutionCopy;
    }

    return solutionCopy;
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

  private createRandomSolutionVariable(course: Course): SolutionVariable {
    return {
      id: course.Course,
      period: this.getRandomPeriod(),
      rooms: this.getRandomRooms(
        course.RoomsRequested.Type,
        course.RoomsRequested.Number,
      ),
    };
  }

  private getRandomPeriod(): number {
    const instance = this.instanceContainer.getInstance();
    return Math.floor(Math.random() * instance.Periods);
  }

  private getRandomRooms(roomType: string, numOfRooms: number): Room[] {
    const instance = this.instanceContainer.getInstance();
    let possibleRooms = instance.Rooms.filter((x) => x.Type === roomType);

    const rooms = [];
    for (let j = 0; j < numOfRooms; j++) {
      const roomIndex = Math.floor(Math.random() * possibleRooms.length);
      const room = possibleRooms[roomIndex];
      possibleRooms = possibleRooms.filter((x) => x.Room !== room.Room);
      rooms.push(room);
    }

    return rooms;
  }

  private calculateFitness(solutionVector: SolutionVariable[]): number {
    solutionVector.forEach((x) => {
      x.hasPeriodConflict = false;
      x.hasRoomConflict = false;
      x.hasSoftConflict = false;
    });

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

        if (curr.period === variable.period) {
          variable.hasPeriodConflict = true;
          return acc + 1;
        }

        return acc;
      }, 0);

      hardConstraints += solutionVector.reduce((acc, curr) => {
        if (curr.period === variable.period && curr.id !== variable.id)
          for (const room1 of curr.rooms)
            for (const room2 of variable.rooms)
              if (room1.Room === room2.Room) {
                variable.hasRoomConflict = true;
                acc += 1;
              }

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
        ) {
          variable.hasSoftConflict = true;
          return acc + 1;
        }

        return acc;
      }, 0);

      const softSecondaryCourses = dependencyGraph[variable.id].softSecondary;

      softConstraints += solutionVector.reduce((acc, curr) => {
        if (!softSecondaryCourses.includes(curr.id)) return acc;

        if (
          Math.abs(curr.period - variable.period) <
          instance.PrimarySecondaryDistance
        ) {
          variable.hasSoftConflict = true;
          return acc + 1;
        }

        return acc;
      }, 0);
    }

    return softConstraints / 2;
  }
}
