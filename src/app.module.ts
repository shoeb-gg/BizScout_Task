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
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsageModule,
    ReportModule,
    BullModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          username: configService.get<string>('REDIS_USERNAME'),
          password: configService.get<string>('REDIS_PASSWORD'),
          tls: {},
        },
        defaultJobOptions: { attempts: 2 },
      }),
    }),
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, PrismaService, UserService, AuthService],
})
export class AppModule {}
