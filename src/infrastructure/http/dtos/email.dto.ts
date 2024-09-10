import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class EmailDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'eventslogin01@yopmail.com', maxLength: 100 })
  email: string;
}
