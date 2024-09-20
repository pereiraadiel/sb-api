import { TransactionalRepository } from '@/domain/repositories/transactional.repository';
import { PrismaProvider } from '@/infra/database/prisma.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConcreteTransactionalRepository
  implements TransactionalRepository
{
  constructor(private readonly prisma: PrismaProvider) {}

  async beginTransaction(operations: any[]): Promise<any[]> {
    return await this.prisma.$transaction(operations);
  }

  async commit(): Promise<void> {
    throw new Error('Method not implemented. prisma does commit automatically');
  }

  async rollback(): Promise<void> {
    throw new Error(
      'Method not implemented. prisma does rollback automatically',
    );
  }
}
