import { Test } from '@nestjs/testing';
import { UsageService } from './usage.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('BillingService', () => {
  let service: UsageService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsageService,
        {
          provide: PrismaService,
          useValue: {}, // Empty mock since calculateTieredCost doesn't use database
        },
      ],
    }).compile();

    service = module.get<UsageService>(UsageService);
  });

  it('should calculate tiered billing correctly', () => {
    expect(service.calculateTieredCost(12000)).toBe(45000);
  });
});
