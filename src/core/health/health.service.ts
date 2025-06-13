import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('reports') private reportsQueue: Queue,
  ) {}

  async healthCheck(): Promise<boolean> {
    const checks = await Promise.all([
      await this.prisma.isHealthy(),
      await this.checkQueue(),
    ]);

    return checks.every(Boolean);
  }

  private async checkQueue(): Promise<boolean> {
    try {
      await this.reportsQueue.getWaiting();
      return true;
    } catch {
      return false;
    }
  }
}
