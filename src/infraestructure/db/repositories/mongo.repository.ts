import { Model } from 'mongoose';

export class MongoRepository<E> {
  constructor(protected readonly entityModel: Model<E>) { }

  /**
   * Return an array with the documents saved in the collection
   * 
   * @returns - Promise resolved with the documents stored in that collection
   */
  async find(): Promise<E[]> {
    return this.entityModel.find();
  }
}
