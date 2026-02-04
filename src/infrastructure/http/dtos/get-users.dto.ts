import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

enum SortByField {
  NAME = 'name',
  LAST_NAME = 'lastName',
  EMAIL = 'email',
}

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetUsersDto {
  @ApiPropertyOptional({
    description: 'The page number to retrieve',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'page must be an integer' })
  @Min(1, { message: 'page must be at least 1' })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'The number of users per page',
    example: 10,
    default: 10,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must be at least 1' })
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: SortByField,
    example: SortByField.NAME,
    default: SortByField.NAME,
  })
  @IsEnum(SortByField, {
    message: 'sortBy must be one of: name, lastName, email',
  })
  @IsOptional()
  sortBy?: SortByField = SortByField.NAME;

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: SortOrder,
    example: SortOrder.ASC,
    default: SortOrder.ASC,
  })
  @IsEnum(SortOrder, {
    message: 'order must be one of: asc, desc',
  })
  @IsOptional()
  order?: SortOrder = SortOrder.ASC;
}
