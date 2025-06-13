import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { UsageService } from '../usage/usage.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectQueue('reports') private reportsQueue: Queue,
    private readonly prisma: PrismaService,
    private readonly usageService: UsageService,
  ) {}

  async generate(user_id: bigint) {
    try {
      const user_usage = await this.usageService.findOne(user_id);

      const job = await this.reportsQueue.add(' generateReport', {
        user_usage,
        priority: 0,
      });

      return {
        data: { jobId: job.id },
        success: true,
        message: `Report generation started with jobId ${job.id}!`,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Server Error while Registering Usage!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
