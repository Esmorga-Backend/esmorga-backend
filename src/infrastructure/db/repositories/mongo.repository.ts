import { Model } from 'mongoose';
import { DBRepository } from '../../../domain/interfaces';

export class MongoRepository<E> implements DBRepository<E> {
  constructor(protected readonly entityModel: Model<E>) {}

  /**
   * Return an array with the documents saved in the collection.
   *
   * @returns Promise resolved with the documents stored in that collection.
   */
  async find(): Promise<E[]> {
    return this.entityModel.find();
  }

  //TODO: Cambiar comentarios
  /**
   * Find documents by accesToken.
   *
   * @param uuid - The uuid to find.
   * @returns Promise resolved with the documents that match uuid provided.
   */
  async findOneByAccessToken(accesToken: string): Promise<E> {
    return this.entityModel.findOne({ accesToken: { $eq: accesToken } });
  }

  /**
   * Find a document by id field.
   *
   * @param id - The id to find.
   * @returns Promise resolved with the document that matches the id provided.
   */
  async findOneById(id: string): Promise<E> {
    return this.entityModel.findOne({ _id: { $eq: id } });
  }

  /**
   * Find documents by uuid.
   *
   * @param uuid - The uuid to find.
   * @returns Promise resolved with the documents that match uuid provided.
   */
  async findByUuid(uuid: string): Promise<E[]> {
    return this.entityModel.find({ uuid: uuid });
  }

  /**
   * Find a document by refreshToken field.
   *
   * @param refreshToken - The refresToken to find.
   * @returns Promise resolved with the document that matches the refreshToken provided.
   */
  async findOneByRefreshToken(refreshToken: string): Promise<E> {
    return this.entityModel.findOne({ refreshToken: { $eq: refreshToken } });
  }

  /**
   * Find a document by email field.
   *
   * @param email - The email value to find.
   * @returns Promise resolved with the document that matches the email provided.
   */
  async findOneByEmail(email: string): Promise<E> {
    return this.entityModel.findOne({ email: { $eq: email } });
  }

  /**
   * Create a new document in the collection.
   *
   * @param data - The data to create the new document.
   */
  async save(data) {
    await this.entityModel.create(data);
  }

  /**
   * Update a document by ID.
   *
   * @param id - The ID of the document to update.
   * @param data - The data to update the document.
   */
  async updateById(id: string, data) {
    await this.entityModel.updateOne({ _id: id }, data);
  }

  /**
   * Remove a document by its ID.
   *
   * @param id - The ID of the document to remove.
   */
  async removeById(id: string) {
    await this.entityModel.findOneAndDelete({ _id: id });
  }
}
