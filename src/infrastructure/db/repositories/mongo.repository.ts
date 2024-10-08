import { Model, Types } from 'mongoose';
import { DBRepository } from '../../../domain/interfaces';
import { ACCOUNT_STATUS } from '../../../domain/const';

export class MongoRepository<E> implements DBRepository<E> {
  constructor(protected readonly entityModel: Model<E>) { }

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
  async findOneByRefreshToken(refreshToken: string): Promise<E | null> {
    return this.entityModel.findOne({ refreshToken: { $eq: refreshToken } });
  }

  /**
   * Find a document by email field.
   *
   * @param email - The email value to find.
   * @returns Promise resolved with the document that matches the email provided.
   */
  async findOneByEmail(email: string): Promise<E | null> {
    return this.entityModel.findOne({ email: { $eq: email } });
  }

  /**
   * Find a document by verificationCode field.
   *
   * @param code - The code value to find.
   * @returns Promise resolved with the document that matches the email provided.
   */
  async findOneByCodeAndType(
    code: string,
    codeType: string,
  ): Promise<E | null> {
    return this.entityModel.findOne({
      code: { $eq: code },
      type: { $eq: codeType },
    });
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

  /**
   * Find a document related to the email provided with the type specified and update the code or
   * create a new document if it does not exist
   *
   * @param code - 6 digits number used as verificationCode or forgotPasswordCode
   * @param type - Code type
   * @param email - User email address
   */
  async findAndUpdateTemporalCode(code: string, type: string, email: string) {
    await this.entityModel.findOneAndUpdate(
      { email, type },
      { $set: { code: code } },
      { upsert: true },
    );
  }

  /**
   * Searches for a document related to the uuid provided and increases login attempts.
   * If the document doesn't exist creates a new one .
   *
   * @param uuid - The uuid to find.
   * @returns Login attempts updated.
   */
  async findAndUpdateLoginAttempts(uuid: string): Promise<E> {
    return this.entityModel.findOneAndUpdate(
      { uuid },
      { $inc: { loginAttempts: 1 } },
      { upsert: true, new: true },
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
   * Update password by email and unblock the user.
   *
   * @param email - Account email address
   * @param password - New password already hashed
   * @returns Account document updated
   */
  async updatePasswordByEmail(email: string, password: string) {
    return this.entityModel.findOneAndUpdate(
      { email: { $eq: email } },
      {
        password: password,
        status: ACCOUNT_STATUS.ACTIVE,
        expireBlockedAt: null,
      },
      { new: true },
    );
  }

  /**
   * Find a document by email, update the status and return the document updated.
   *
   * @param email - User email address.
   * @param newStatus - Status value to update.
   * @returns Account document updated related to that email
   */
  async updateStatusByEmail(email: string, newStatus: string): Promise<E> {
    return this.entityModel.findOneAndUpdate(
      { email },
      { status: newStatus, expireBlockedAt: null },
      { new: true },
    );
  }

  /**
   * Find a document by uuid and update the status to BLOCKED.
   *
   * @param email - User email address.
   * @param newStatus - Status value to update.
   */
  async updateBlockedStatusByUuid(
    uuid: string,
    newStatus: string,
    unblockDate: Date,
  ) {
    await this.entityModel.findOneAndUpdate(
      { _id: uuid },
      {
        $set: {
          status: newStatus,
          expireBlockedAt: unblockDate,
        },
      },
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
   * Remove a document by uuid field.
   *
   * @param uuid - The uuid user to remove the document.
   */
  async removeByUuid(uuid: string) {
    await this.entityModel.findOneAndDelete({ uuid });
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
