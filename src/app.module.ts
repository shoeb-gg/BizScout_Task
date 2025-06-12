import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsageModule } from './modules/usage/usage.module';
import { UserService } from './core/user/user.service';
import { AuthService } from './core/auth/auth.service';
import { AuthController } from './core/auth/auth.controller';

@Module({
  imports: [UsageModule],
  controllers: [AppController, AuthController],
  providers: [AppService, PrismaService, UserService, AuthService],
})
export class AppModule {}
