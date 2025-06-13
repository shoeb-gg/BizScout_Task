import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsageService } from '../usage/usage.service';
import { ReportsConsumer } from './generators/pdf-generator';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'reports',
    }),
  ],
  controllers: [ReportController],
  providers: [ReportService, PrismaService, UsageService, ReportsConsumer],
})
export class ReportModule {}
