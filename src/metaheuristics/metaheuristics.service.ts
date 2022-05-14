import { Injectable } from '@nestjs/common';
import { Solution, SolutionVariable } from 'src/app/interfaces';
import { Course, Room } from 'src/instance-container/interfaces';
import { InstanceContainer } from 'src/instance-container/instance-container.service';
import { SolutionOutput } from 'src/app/interfaces/solution-ouput.interface';
import * as fs from 'fs';

@Injectable()
export class MetaheuristicsService {
  constructor(private readonly instanceContainer: InstanceContainer) {}

  logSolutionVector(solution: Solution): void {
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

  saveSolution(solution: Solution): void {
    const solutionOutput: SolutionOutput = {
      Assignments: solution.solutionVector.map((x) => ({
        Course: x.id,
        Period: x.period,
        Room: x.rooms.map((x) => x.Room).join(', '),
      })),
      Cost: solution.fitness,
    };

    const output = JSON.stringify(solutionOutput);
    const filename = `solutions/${
      this.instanceContainer.getInstance().Name
    }.output.json`;
    fs.writeFileSync(filename, output);
  }

  createRandomSolutionVector(): SolutionVariable[] {
    const solutionVector: SolutionVariable[] = [];
    const instance = this.instanceContainer.getInstance();

    for (let i = 0; i < instance.Courses.length; i++) {
      const course = instance.Courses[i];
      const variable = this.createRandomSolutionVariable(course);
      solutionVector.push(variable);
    }

    return solutionVector;
  }

  createRandomSolutionVariable(course: Course): SolutionVariable {
    return {
      id: course.Course,
      period: this.getRandomPeriod(),
      rooms: this.getRandomRooms(
        course.RoomsRequested.Type,
        course.RoomsRequested.Number,
      ),
    };
  }

  getRandomPeriod(): number {
    const instance = this.instanceContainer.getInstance();
    return Math.floor(Math.random() * instance.Periods);
  }

  getRandomRooms(roomType: string, numOfRooms: number): Room[] {
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

  calculateFitness(solutionVector: SolutionVariable[]): number {
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
