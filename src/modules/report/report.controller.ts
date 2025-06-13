import { Controller, Get, Param, Post } from '@nestjs/common';
import { ReportService } from './report.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import { JobState } from 'bullmq';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post(':user_id')
  async generate(@Param('user_id') user_id: bigint) {
    return await this.reportService.generate(user_id);
  }

  @Get('status/:job_id')
  async getJobStatus(
    @Param('job_id') job_id: string,
  ): Promise<ResponseDto<JobState | 'unknown'>> {
    return await this.reportService.getJobStatus(job_id);
  }
}
