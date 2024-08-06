import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AccountLoginDto {
  /**
   * Transform is executed before @IsString() decorator so if value is not a string, @Transform()
   * returns the request body value and breaks with @IsString() decorator logic
   */
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'esmorga.test.01@yopmail.com', maxLength: 100 })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Password01', minLength: 8, maxLength: 50 })
  password: string;
}
