import { Expose, Transform } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class PairOfTokensDto {
  @Transform((value) => value.obj._id.toString())
  @Expose({ name: '_id' })
  @IsString()
  id: string;

  @Expose()
  @IsString()
  uuid: string;

  @Expose()
  @IsString()
  accessToken: string;

  @Expose()
  @IsString()
  refreshToken: string;

  @Expose()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  createdAt: Date;

  @Expose()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  updatedAt: Date;
}
