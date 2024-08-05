import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JoinEventDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '6670301dfcb094d1f8f3ea8d' })
  eventId: string;
}
