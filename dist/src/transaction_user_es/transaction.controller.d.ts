import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction-statut.dto';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    createTransaction(dto: CreateTransactionDto): Promise<import("./entities/transaction.entity").Transaction>;
    updateTransactionStatus(id: number, dto: UpdateTransactionStatusDto): Promise<import("./entities/transaction.entity").Transaction>;
    getTransaction(id: number): Promise<import("./entities/transaction.entity").Transaction>;
    getAllTransactions(): Promise<import("./entities/transaction.entity").Transaction[]>;
}
