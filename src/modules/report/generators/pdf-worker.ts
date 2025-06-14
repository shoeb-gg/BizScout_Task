import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PdfGeneratorService } from './pdf-generator.service';

@Processor('reports', { limiter: { duration: 60000, max: 20 }, concurrency: 2 })
export class ReportsConsumer extends WorkerHost {
  constructor(private readonly pdfGenerator: PdfGeneratorService) {
    super();
  }
  async process(job: Job): Promise<any> {
    console.log('starting to work on PDF generation job with id:', job.id);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await this.pdfGenerator.generateMonthlyReport(job.data.data.user_id);

    console.log('finished work on PDF generation job with id:', job.id);

    return;
  }
}
