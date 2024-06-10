import { Model } from 'mongoose';
import { DBRepository } from '../../../domain/interfaces';

export class MongoRepository<E> implements DBRepository<E> {
  constructor(protected readonly entityModel: Model<E>) {}

  /**
   * Return an array with the documents saved in the collection.
   *
   * @returns - Promise resolved with the documents stored in that collection.
   */
  async find(): Promise<E[]> {
    return this.entityModel.find();
  }

  async findByUuid(uuid): Promise<E[]> {
    return this.entityModel.find({ uuid: uuid });
  }

  async findOneByEmail(email): Promise<E> {
    return this.entityModel.findOne({ email: email });
  }

  async save(data) {
    await this.entityModel.create(data);
  }
}
