import { Expose, Transform } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class TemporalCodeDto {
  @Expose({ name: '_id' })
  @Transform((value) => value.obj._id.toString())
  @IsString()
  id: string;

  @Expose()
  @IsNumber()
  code: number;

  @Expose()
  @IsString()
  type: string;

  @Expose()
  @IsString()
  email: string;

  @Expose()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  createdAt: Date;

  @Expose()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  updatedAt: Date;
}
