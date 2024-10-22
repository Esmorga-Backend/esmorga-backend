import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class UserListDto {
  @IsNumber()
  @ApiProperty({ example: 1 })
  totalUsers: number;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String], example: '[ Mia Thermopolis, Phoebe Buffay]' })
  users: string[];
}
