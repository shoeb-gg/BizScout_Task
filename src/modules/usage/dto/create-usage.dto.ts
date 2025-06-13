import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { event_type } from 'src/common/enums/usage-event.enum';

export class CreateUsageDto {
  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsOptional()
  @IsString()
  event: event_type;

  @IsNotEmpty()
  @IsInt()
  user_id: bigint;
}
