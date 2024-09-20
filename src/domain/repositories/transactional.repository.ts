export const TRANSACTIONAL_REPOSITORY = 'TRANSACTIONAL_REPOSITORY';

export interface TransactionalRepository {
  beginTransaction(operations: any[]): Promise<any[]>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
