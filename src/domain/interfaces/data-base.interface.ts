export interface DBRepository<E> {
  find(): Promise<E[]>;
  findByUuid(uuid: string): Promise<E[]>;
  findOneByEmail(email: string): Promise<E>;
  save(data);
  updateById(id: string, data);
  removeById(id: string);
}
