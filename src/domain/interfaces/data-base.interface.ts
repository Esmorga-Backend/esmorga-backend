export interface DBRepository<E> {
  find(): Promise<E[]>;
  findByUuid(uuid: string): Promise<E[]>;
  findOneByEmail(email: string): Promise<E>;
  findOneByRefreshToken(refreshToken: string): Promise<E>;
  findOneByAccessToken(acessToken: string): Promise<E>;
  save(data);
  updateById(id: string, data);
  removeById(id: string);
}
