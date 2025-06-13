import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaService } from 'src/prisma/prisma.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TerminusModule,
    BullModule.registerQueue({
      name: 'reports',
    }),
  ],
  controllers: [HealthController],
  providers: [HealthService, PrismaService],
})
export class HealthModule {}
