// ----------------------
// Contrôleur Transaction
// ----------------------
// import { Controller, Post, Body, Param, Get } from '@nestjs/common';
// import { TransactionService } from './transaction-interne.service';

// @Controller('transactions')
// export class TransactionController {
//   constructor(private readonly transactionService: TransactionService) {}

//   @Post('paiement-qrcode')
//   async paiementQrCode(
//     @Body('id_compte_expediteur') idCompteEmetteur: number,
//     @Body('id_compte_recepteur') idCompteRecepteur: number,
//     @Body('montant') montant: number,
//     @Body('devise_transaction') devise: string
//   ) {
//     return this.transactionService.paiementQrCode(idCompteEmetteur, idCompteRecepteur, montant, devise);
//   }

  // @Get('frais/:id')
  // async getTransactionFrais(@Param('id') idTransaction: number) {
  //   return this.transactionService.getFraisByTransaction(idTransaction);
  // }
// }

import { Controller, Post, Body, Get, Param, BadRequestException } from '@nestjs/common';
import { TransactionService } from './transaction-interne.service';

class ProcessTransactionDto {
  compteId: number;
  qrCodeToken: string;
  montant: number;
}

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('process')
  processTransaction(@Body() processTransactionDto: ProcessTransactionDto) {
    if (!processTransactionDto.montant || processTransactionDto.montant <= 0) {
      throw new BadRequestException('Le montant doit être un nombre positif');
    }

    return this.transactionService.processTransaction(
      processTransactionDto.compteId,
      processTransactionDto.qrCodeToken,
      processTransactionDto.montant
    );
  }

  @Get(':id')
  getTransactionById(@Param('id') id: string) {
    return this.transactionService.getTransactionById(+id);
  }

  @Get('frais/:id')
  async getTransactionFrais(@Param('id') idTransaction: number) {
    return this.transactionService.getFraisByTransaction(idTransaction);
  }
}
