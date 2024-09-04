export interface DBRepository<E> {
  find(): Promise<E[]>;
  findByUuid(uuid: string): Promise<E[]>;
  findByEventIds(eventIds: string[]): Promise<E[]>;
  findOneByAccessToken(accessToken: string): Promise<E>;
  findOneByEmail(email: string): Promise<E>;
  findOneById(id: string): Promise<E>;
  findOneByRefreshToken(refreshToken: string): Promise<E>;
  findEventParticipant(userId: string): Promise<E[]>;
  findAndUpdateParticipantsList(eventId: string, userId: string);
  findAndUpdateVerificationCode(code: number, email: string);
  save(data);
  updateById(id: string, data: object): Promise<E>;
  removePartipantFromList(eventId: string, userId: string);
  removeById(id: string);
  removeByEventId(eventId: string);
}
