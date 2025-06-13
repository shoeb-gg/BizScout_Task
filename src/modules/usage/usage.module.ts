import { Module } from '@nestjs/common';
import { UsageService } from './usage.service';
import { UsageController } from './usage.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UsageController],
  providers: [UsageService, PrismaService],
  exports: [UsageService],
})
export class UsageModule {}
