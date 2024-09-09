import { Model, Types } from 'mongoose';
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

  /**
   * Find documents by accesToken.
   *
   * @param accessToken - The accesToken to find.
   * @returns Promise resolved with the document that matches the accessToken provided.
   */
  async findOneByAccessToken(accessToken: string): Promise<E> {
    return this.entityModel.findOne({ accessToken: { $eq: accessToken } });
  }

  /**
   * Find a document by id field.
   *
   * @param id - The id to find.
   * @returns Promise resolved with the document that matches the id provided.
   */
  async findOneById(id: string): Promise<E> {
    return this.entityModel.findById({ _id: id });
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
   * Find events document with the IDs provided in STRING format. The logic transform the strings IDs into mongo ObjectId before execute the query
   * @param eventIds - Array of events identifiers
   * @returns Promise with event that match with the ID list provided
   */
  async findByEventIds(eventIds: string[]): Promise<E[]> {
    const objectIds = eventIds.map((id) => {
      return new Types.ObjectId(id);
    });

    return this.entityModel.find({ _id: { $in: objectIds } });
  }

  /**
   * Find the documents where user joined as participant
   * @param userId - User identifier
   * @returns Promise resolved the the documents that has the userId in the participant list
   */
  async findEventParticipant(userId: string): Promise<E[]> {
    return this.entityModel.find({ participants: { $in: [userId] } });
  }

  /**
   * Find a document with that eventId and add the userId as participant if it has not been added yet. Also
   * if the document has not been created, create a new one with this data.
   *
   * @param eventId - Event identificator.
   * @param userId - User identificator to add as participant.
   */
  async findAndUpdateParticipantsList(eventId: string, userId: string) {
    await this.entityModel.findOneAndUpdate(
      { eventId },
      { $addToSet: { participants: userId } },
      { upsert: true },
    );
  }

  async findAndUpdateVerificationCode(code: number, email: string) {
    await this.entityModel.findOneAndUpdate(
      { email },
      { $set: { verificationCode: code } },
      { upsert: true },
    );
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
   * Remove document fields by ID.
   *
   * @param id - The ID of the document to remove fields.
   * @param data - The data to remove.
   */
  async removeFieldsById(id: string, data: object): Promise<E> {
    return this.entityModel.findOneAndUpdate(
      { _id: id },
      { $unset: data },
      { new: true },
    );
  }

  /**
   * Update a document by ID.
   *
   * @param id - The ID of the document to update.
   * @param data - The data to update the document.
   */
  async updateById(id: string, data: object): Promise<E> {
    return this.entityModel.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true },
    );
  }

  /**
   * Find a document by email and update password property
   *
   * @param email - Account email address
   * @param password - New password already hashed
   */
  async updatePasswordByEmail(email: string, password: string) {
    return this.entityModel.findOneAndUpdate(
      { email: { $eq: email } },
      { password: password },
    );
  }

  /**
   * Find a document with that eventId and update it removing the userId from the particpant list.
   * @param eventId - Event identificator.
   * @param userId - User identificator to add as participant.
   */
  async removePartipantFromList(eventId: string, userId: string) {
    await this.entityModel.updateOne(
      { eventId },
      { $pull: { participants: userId } },
    );
  }

  /**
   * Remove a document by its ID.
   *
   * @param id - The ID of the document to remove.
   */
  async removeById(id: string) {
    await this.entityModel.findOneAndDelete({ _id: id });
  }

  /**
   * Remove a document by eventId field.
   *
   * @param eventId - The eventId of the document to remove.
   */
  async removeByEventId(eventId: string) {
    await this.entityModel.findOneAndDelete({ eventId: { $eq: eventId } });
  }
}
