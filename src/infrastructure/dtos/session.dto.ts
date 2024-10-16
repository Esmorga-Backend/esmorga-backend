import { Expose, Transform } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class SessionDto {
  @Transform((value) => value.obj._id.toString())
  @Expose({ name: '_id' })
  @IsString()
  id: string;

  @Expose()
  @IsString()
  uuid: string;

  @Expose()
  @IsString()
  sessionId: string;

  @Expose()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  createdAt: Date;

  @Expose()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  updatedAt: Date;
}
