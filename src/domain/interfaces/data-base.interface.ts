export interface DBRepository<E> {
  find(): Promise<E[]>;
  findByUuid(uuid: string): Promise<E[]>;
  findByEventIds(eventIds: string[]): Promise<E[]>;
  findOneByAccessToken(accessToken: string): Promise<E>;
  findOneByEmail(email: string): Promise<E | null>;
  findOneById(id: string): Promise<E>;
  findOneByRefreshToken(refreshToken: string): Promise<E | null>;
  findOneByCodeAndType(code: string, codeType: string): Promise<E | null>;
  findEventParticipant(userId: string): Promise<E[]>;
  findAndUpdateParticipantsList(eventId: string, userId: string);
  findAndUpdateTemporalCode(code: string, type: string, email: string);
  findAndUpdateLoginAttemps(uuid: string): Promise<E>;
  save(data);
  updateBlockedStatusByUuid(uuid: string, newStatus: string, unblockDate: Date);
  updateById(id: string, data: object): Promise<E>;
  updatePasswordByEmail(email: string, password: string);
  updateStatusByEmail(email: string, newStatus: string): Promise<E>;
  removePartipantFromList(eventId: string, userId: string);
  removeById(id: string);
  removeByEventId(eventId: string);
}
