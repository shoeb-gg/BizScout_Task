import { Controller, Param, Post } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post(':user_id')
  async generate(@Param('user_id') user_id: bigint) {
    return await this.reportService.generate(user_id);
  }
}
