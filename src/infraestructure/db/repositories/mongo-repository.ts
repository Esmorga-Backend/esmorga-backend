import { Model } from 'mongoose';

export class MongoRepository<E> {
  constructor(protected readonly entityModel: Model<E>) {}

  async find(): Promise<E[]> {
    return this.entityModel.find();
  }
}
