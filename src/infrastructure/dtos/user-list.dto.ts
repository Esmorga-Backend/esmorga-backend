import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class UserListDto {
  @IsNumber()
  @ApiProperty({ example: 1 })
  totalUsers: number;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ example: ['Mia Thermopolis', 'Phoebe Buffay'] })
  users: string[];
}
