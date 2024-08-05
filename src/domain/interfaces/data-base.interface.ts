export interface DBRepository<E> {
  find(): Promise<E[]>;
  findByUuid(uuid: string): Promise<E[]>;
  findOneByAccessToken(accessToken: string): Promise<E>;
  findOneByEmail(email: string): Promise<E>;
  findOneById(id: string): Promise<E>;
  findOneByRefreshToken(refreshToken: string): Promise<E>;
  findAndUpdateParticipantsList(eventId: string, userId: string);
  save(data);
  updateById(id: string, data: object): Promise<E>;
  removeById(id: string);
  removeFieldsById(id: string, data: object): Promise<E>;
}
