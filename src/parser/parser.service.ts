import { Injectable } from '@nestjs/common';
import { Instance } from './interfaces';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ParserService {
  private instance: Instance;

  loadInstance(instanceName: string): void {
    if (!instanceName) {
      throw new Error('Instance name is required');
    }

    try {
      const file = fs.readFileSync(
        path.join(__dirname, '..', '..', 'instances', `${instanceName}.json`),
        'utf8',
      );
      this.instance = JSON.parse(file);
    } catch (error) {
      throw new Error(`Instance ${instanceName} not found or invalid`);
    }
  }

  getInstance(): Instance {
    return this.instance;
  }
}
