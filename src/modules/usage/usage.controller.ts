import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsageService } from './usage.service';
import { CreateUsageDto } from './dto/create-usage.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { Usage } from './entities/usage.entity';
import { GetUsageDto } from './dto/get-usage.dto';

@Controller('usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Post()
  async create(
    @Body() createUsageDto: CreateUsageDto,
  ): Promise<ResponseDto<Usage>> {
    return await this.usageService.create(createUsageDto);
  }

  @Get(':user_id')
  async findOne(
    @Param('user_id') user_id: bigint,
  ): Promise<ResponseDto<GetUsageDto | null>> {
    return await this.usageService.getMonthlyUsage(user_id);
  }
}
