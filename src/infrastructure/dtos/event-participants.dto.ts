import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsString } from 'class-validator';

export class EventParticipantsDto {
  @Transform((value) => value.obj._id.toString())
  @Expose({ name: '_id' })
  @IsString()
  eventId: string;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  participants: string[];

  @Expose()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  createdAt: Date;

  @Expose()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  updatedAt: Date;
}
