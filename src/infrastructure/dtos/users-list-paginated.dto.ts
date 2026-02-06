import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type, Expose } from 'class-transformer';

export class UserPaginatedItemDto {
  @Expose()
  @IsString()
  @ApiProperty({ example: '64b0f37d9c8d4b3e8a123456' })
  id: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'Alice', maxLength: 100, minLength: 1 })
  name: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'Cooper', maxLength: 100, minLength: 1 })
  lastName: string;

  @Expose()
  @IsString()
  @ApiProperty({
    example: 'alice.cooper@yopmail.com',
    maxLength: 100,
    minLength: 1,
  })
  email: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'USER', enum: ['USER', 'ADMIN'] })
  role: string;
}

export class PaginationMetaDto {
  @IsNumber()
  @ApiProperty({ example: 1 })
  currentPage: number;

  @IsNumber()
  @ApiProperty({ example: 10 })
  itemsPerPage: number;

  @IsNumber()
  @ApiProperty({ example: 45 })
  totalItems: number;

  @IsNumber()
  @ApiProperty({ example: 5 })
  totalPages: number;
}

export class UsersListPaginatedDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserPaginatedItemDto)
  @ApiProperty({ type: [UserPaginatedItemDto] })
  users: UserPaginatedItemDto[];

  @ValidateNested()
  @Type(() => PaginationMetaDto)
  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
