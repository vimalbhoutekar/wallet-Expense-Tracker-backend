import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateTransactionDto) {
    return this.prisma.transaction.create(
      {
        data : data
      }
    )
  }

  findOne(id: number) {
    return this.prisma.transaction.findUnique({
      where: { id: id }
    })
  }

  async remove(id : number) {
    const existing = await this.prisma.transaction.findUnique({
      where: { id: id }
    });
    if (!existing) {
      throw new Error('Transaction not found');
    }
    return this.prisma.transaction.delete({
      where: { id: id }
    });
  }

  async getBalance(){
    const all = await this.prisma.transaction.findMany();
    const income = all.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = all.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return {
      income,
      expense,
      balance: income - expense
    };
  }
}

