import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from './../prisma';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTransactionDto) {
    const transactions = await this.prisma.transaction.findMany();

    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentBalance = income - expense;

    if (data.type === 'expense' && data.amount > currentBalance) {
      throw new Error('Insufficient balance! Cannot make this expense.');
    }

    return this.prisma.transaction.create({
      data: data,
    });
  }

  async findOne(id: number) {
     const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found in database`);
    }

    return transaction;
  }

  async findAll() {
    return await this.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: number) {
    return await this.prisma.transaction.delete({
      where: { id: id },
    });
  }

  async getBalance() {
    const all = await this.prisma.transaction.findMany();
    const income = all
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = all
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      income,
      expense,
      balance: income - expense,
    };
  }
}
