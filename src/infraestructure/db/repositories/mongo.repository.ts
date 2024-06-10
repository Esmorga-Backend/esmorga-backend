import { Model } from 'mongoose';
import { DBRepository } from '../../../domain/interfaces';

export class MongoRepository<E> implements DBRepository<E> {
  constructor(protected readonly entityModel: Model<E>) {}

  /**
   * A document with the new event is saved in the collection.
   */
  async create(event: E) {
    await this.entityModel.create(event);
  }

  /**
   * Return an array with the documents saved in the collection.
   *
   * @returns - Promise resolved with the documents stored in that collection.
   */
  async find(): Promise<E[]> {
    return this.entityModel.find();
  }
}
