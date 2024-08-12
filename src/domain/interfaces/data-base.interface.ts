export interface DBRepository<E> {
  find(): Promise<E[]>;
  findByUuid(uuid: string): Promise<E[]>;
  findById(id: string): Promise<E>;
  findByEventIds(eventIds: string[]): Promise<E[]>;
  findOneByEmail(email: string): Promise<E>;
  findOneByRefreshToken(refreshToken: string): Promise<E>;
  findOneByAccessToken(acessToken: string): Promise<E>;
  findEventParticipant(userId: string): Promise<E[]>;
  findAndUpdateParticipantsList(eventId: string, userId: string);
  save(data);
  updateById(id: string, data);
  removeById(id: string);
}
