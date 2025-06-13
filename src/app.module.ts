import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsageModule } from './modules/usage/usage.module';
import { UserService } from './core/user/user.service';
import { AuthService } from './core/auth/auth.service';
import { AuthController } from './core/auth/auth.controller';
import { ReportModule } from './modules/report/report.module';
import { BullModule } from '@nestjs/bullmq';
import { HealthModule } from './core/health/health.module';

@Module({
  imports: [
    UsageModule,
    ReportModule,
    BullModule.forRoot({
      connection: {
        host: 'singapore-keyvalue.render.com',
        port: 6379,
        username: 'red-d15ube6mcj7s73dqf9qg',
        password: '3AYrCyDGUjv8zLnuGWVAaW1KApTcgrNN',
        tls: {},
      },
      defaultJobOptions: { attempts: 2 },
    }),
    HealthModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, PrismaService, UserService, AuthService],
})
export class AppModule {}
