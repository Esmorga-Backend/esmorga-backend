export interface DBRepository<E> {
    find(): Promise<E[]>;
}