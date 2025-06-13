import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { JobState, Queue } from 'bullmq';
import { UsageService } from '../usage/usage.service';
import { ResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectQueue('reports') private reportsQueue: Queue,
    private readonly usageService: UsageService,
  ) {}

  async generate(user_id: bigint) {
    try {
      const user_usage = await this.usageService.findOne(user_id);

      const job = await this.reportsQueue.add('generateReport', {
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

  async getJobStatus(
    job_id: string,
  ): Promise<ResponseDto<JobState | 'unknown'>> {
    try {
      const jobStatus: JobState | 'unknown' =
        await this.reportsQueue.getJobState(job_id);

      return {
        data: jobStatus,
        success: true,
        message: `The current status of the job with jobId: ${job_id} is ${jobStatus}`,
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Server Error while getting job status!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
