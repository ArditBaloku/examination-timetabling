import { Injectable } from '@nestjs/common';
import { Instance, DependencyGraph, Course } from './interfaces';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ParserService {
  private instance: Instance;
  private dependencyGraph: DependencyGraph;

  getInstance(): Instance {
    return this.instance;
  }

  getDependencyGraph(): DependencyGraph {
    return this.dependencyGraph;
  }

  loadInstance(instanceName: string): void {
    this.instance = this.readInstance(instanceName);
    this.dependencyGraph = this.createDependencyGraph(this.instance);
  }

  private readInstance(instanceName: string): Instance {
    if (!instanceName) {
      throw new Error('Instance name is required');
    }

    try {
      const file = fs.readFileSync(
        path.join(__dirname, '..', '..', 'instances', `${instanceName}.json`),
        'utf8',
      );
      return JSON.parse(file);
    } catch (error) {
      throw new Error(`Instance ${instanceName} not found or invalid`);
    }
  }

  private createDependencyGraph(instance: Instance): DependencyGraph {
    const dependencyGraph: DependencyGraph = {};

    for (const course of instance.Courses) {
      dependencyGraph[course.Course] = {
        hard: this.getHardConflictsForCourse(instance, course),
        softPrimary: this.getSoftPrimaryConflictsForCourse(instance, course),
        softSecondary: this.getSoftSecondaryConflictsForCourse(
          instance,
          course,
        ),
      };
    }

    return dependencyGraph;
  }

  private getHardConflictsForCourse(
    instance: Instance,
    course: Course,
  ): string[] {
    const primaryCurriculumCourses = instance.Curricula.map(
      (x) => x.PrimaryCourses,
    )
      .filter((x) => x.includes(course.Course))
      .flat();

    const sameTeacherCourses = instance.Courses.filter(
      (x) => x.Teacher === course.Teacher,
    ).map((x) => x.Course);

    const hardConflicts = new Set([
      ...primaryCurriculumCourses,
      ...sameTeacherCourses,
    ]);

    hardConflicts.delete(course.Course);

    return [...hardConflicts];
  }

  private getSoftPrimaryConflictsForCourse(
    instance: Instance,
    course: Course,
  ): string[] {
    const primaryCurriculumCourses = instance.Curricula.map(
      (x) => x.PrimaryCourses,
    )
      .filter((x) => x.includes(course.Course))
      .flat();

    const softPrimary = new Set([...primaryCurriculumCourses]);

    softPrimary.delete(course.Course);

    return [...softPrimary];
  }

  private getSoftSecondaryConflictsForCourse(
    instance: Instance,
    course: Course,
  ): string[] {
    const primarySecondary = instance.Curricula.filter((x) =>
      x.PrimaryCourses.includes(course.Course),
    ).flatMap((x) => x.SecondaryCourses);

    const secondaryPrimary = instance.Curricula.filter((x) =>
      x.SecondaryCourses.includes(course.Course),
    ).flatMap((x) => x.PrimaryCourses);

    const softSecondary = new Set([...primarySecondary, ...secondaryPrimary]);

    softSecondary.delete(course.Course);

    return [...softSecondary];
  }
}
