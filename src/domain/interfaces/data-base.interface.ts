export interface DBRepository<E> {
  find(): Promise<E[]>;
  findByUuid(uuid: string): Promise<E[]>;
  findById(id: string): Promise<E>;
  findOneByEmail(email: string): Promise<E>;
  findOneByRefreshToken(refreshToken: string): Promise<E>;
  findOneByAccessToken(acessToken: string): Promise<E>;
  findAndUpdateParticipantsList(eventId: string, userId: string);
  save(data);
  updateById(id: string, data);
  removePartipantFromList(eventId: string, userId: string);
  removeById(id: string);
}
