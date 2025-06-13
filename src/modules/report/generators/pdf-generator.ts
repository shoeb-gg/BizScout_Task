import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('reports')
export class ReportsConsumer extends WorkerHost {
  async process(job: Job): Promise<any> {
    console.log('starting to work on PDF generation job with id:', job.id);

    await new Promise((resolve) => {
      setTimeout(() => {
        console.log('finished  work on PDF generation job with id:', job.id);
        resolve(null);
      }, 5000);
    });

    return;
  }
}
