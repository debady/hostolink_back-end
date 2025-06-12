
import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction-statut.dto';


@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService,

  ) {}

  @Post()
  async createTransaction(@Body() dto: CreateTransactionDto) {
    return this.transactionService.createTransaction(dto);
  }

   @Patch(':id/status')
  async updateTransactionStatus(@Param('id') id: number, @Body() dto: UpdateTransactionStatusDto) {
    return this.transactionService.updateTransactionStatus(id, dto);
  }

  @Get(':id')
  async getTransaction(@Param('id') id: number) {
    return this.transactionService.getTransaction(id);
  }
  
  @Get()
  async getAllTransactions() {
    return this.transactionService.getAllTransactions();
  }
  
}