import { event_type } from 'generated/prisma';

export class Usage {
  id?: bigint;
  created_at: Date;
  quantity: number;
  event: event_type;
  user_id: bigint;
}
