import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction-statut.dto';



@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepo.create({
      ...dto,
      statut: 'en_attente',
    });
    return this.transactionRepo.save(transaction);
  }

  async updateTransactionStatus(id: number, dto: UpdateTransactionStatusDto): Promise<Transaction> {
    const transaction = await this.transactionRepo.findOneBy({ id });
    if (!transaction) throw new NotFoundException('Transaction non trouvée');
    transaction.statut = dto.statut;
    return this.transactionRepo.save(transaction);
  }

  async getTransaction(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepo.findOneBy({ id });
    if (!transaction) throw new NotFoundException('Transaction non trouvée');
    return transaction;
  }
// Récupérer toutes les transactions
  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionRepo.find();
  }

}