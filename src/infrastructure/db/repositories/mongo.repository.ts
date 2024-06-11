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

  async findByUuid(uuid: string): Promise<E[]> {
    return this.entityModel.find({ uuid: uuid });
  }

  async findOneByEmail(email: string): Promise<E> {
    return this.entityModel.findOne({ email: email });
  }

  async save(data) {
    await this.entityModel.create(data);
  }

  async updateById(id: string, data) {
    await this.entityModel.updateOne({ _id: id }, data);
  }
  async removeById(id: string) {
    await this.entityModel.findOneAndDelete({ _id: id });
  }
}
