import { Injectable, NotImplementedException } from '@nestjs/common';
import { TemporalCodeDto } from '../../../dtos';

@Injectable()
export class TemporalCodeDA {
  findAndUpdateTemporalCode(
    _code: string,
    _type: string,
    _email: string,
  ): Promise<void> {
    throw new NotImplementedException();
  }
  findOneByCodeAndType(
    _code: string,
    _codeType: string,
  ): Promise<TemporalCodeDto> {
    throw new NotImplementedException();
  }
  removeById(_id: string): Promise<void> {
    throw new NotImplementedException();
  }
}
