import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction-statut.dto';
export declare class TransactionService {
    private readonly transactionRepo;
    constructor(transactionRepo: Repository<Transaction>);
    createTransaction(dto: CreateTransactionDto): Promise<Transaction>;
    updateTransactionStatus(id: number, dto: UpdateTransactionStatusDto): Promise<Transaction>;
    getTransaction(id: number): Promise<Transaction>;
    getAllTransactions(): Promise<Transaction[]>;
}
