import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsageDto } from './dto/create-usage.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Usage } from './entities/usage.entity';
import { ResponseDto } from 'src/common/dto/response.dto';
import { BILLING_RATES } from 'src/constants/api-billing.constant';
import { GetUsageDto } from './dto/get-usage.dto';

@Injectable()
export class UsageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUsageDto: CreateUsageDto): Promise<ResponseDto<Usage>> {
    try {
      const newUsage: Usage = await this.prisma.usage.create({
        data: { ...createUsageDto },
      });

      const returnObj = this.serializeBigInt(newUsage);

      return {
        data: returnObj,
        success: true,
        message: 'Usage Registered Successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Server Error while Registering Usage!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMonthlyUsage(
    user_id: bigint,
  ): Promise<ResponseDto<GetUsageDto | null>> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const usages = await this.prisma.usage.aggregate({
        where: {
          user_id: user_id,
          created_at: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { quantity: true },
      });

      const usageReport: GetUsageDto = {
        quantity: usages._sum.quantity ? usages._sum.quantity : 0,
        totalCost: usages._sum.quantity
          ? usages._sum.quantity * BILLING_RATES.API_CALL
          : 0,
        currency: BILLING_RATES.CURRENCY,
      };

      return {
        data: usageReport.quantity ? usageReport : null,
        success: usageReport.quantity ? true : false,
        message: usageReport.quantity
          ? 'Usage Data Fetched Successfully!'
          : `No Usage Data Found for User with id ${user_id}`,
        status: usageReport.quantity ? HttpStatus.OK : HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Server Error while fetching Usage Data!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  serializeBigInt = (obj: any) => {
    return JSON.parse(
      JSON.stringify(obj, (_, v) => (typeof v === 'bigint' ? v.toString() : v)),
    );
  };
}
