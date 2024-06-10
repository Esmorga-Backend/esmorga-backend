export interface DBRepository<E> {
  find(): Promise<E[]>;
  findOneByEmail(email: string): Promise<E>;
  save(data);
}
