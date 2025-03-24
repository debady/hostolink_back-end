// // src/transaction/transaction.controller.ts
// import { Controller, Get, Post, Body, Param, UseGuards, Req, ParseIntPipe, BadRequestException } from '@nestjs/common';
// // import { TransactionService } from './transaction.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// // import { PayWithQrDto } from './dto/pay-with-qr.dto';
// // import { PayWithPhoneDto } from './dto/pay-with-phone.dto';
// // import { UserService } from '../user/user.service';
// import { ModuleRef } from '@nestjs/core';

// @Controller('transactions')
// export class TransactionController {
//   constructor(
//     private readonly transactionService: TransactionService,
//     private readonly moduleRef: ModuleRef
//   ) {}

//   /**
//    * Effectue un paiement en utilisant un QR code
//    */
//   @Post('pay-with-qr')
//   @UseGuards(JwtAuthGuard)
//   async payWithQrCode(@Req() req, @Body() payWithQrDto: PayWithQrDto) {
//     const id_user = req.user.id_user;
    
//     const transaction = await this.transactionService.createTransactionFromQrCode(
//       id_user,
//       payWithQrDto.token,
//       payWithQrDto.montant
//     );
    
//     return {
//       success: true,
//       message: 'Transaction effectuée avec succès',
//       data: {
//         id_transaction: transaction.id_transaction,
//         montant_total: Number(transaction.montant),
//         frais: Number(transaction.frais_transaction),
//         montant_recu: Number(transaction.montant) - Number(transaction.frais_transaction),
//         statut: transaction.statut,
//         date_transaction: transaction.date_transaction
//       }
//     };
//   }

//   /**
//    * Effectue un paiement en utilisant un numéro de téléphone
//    */
//   @Post('pay-with-phone')
//   @UseGuards(JwtAuthGuard)
//   async payWithPhone(@Req() req, @Body() payWithPhoneDto: PayWithPhoneDto) {
//     const id_user = req.user.id_user;
    
//     // Vérifier que l'utilisateur ne tente pas d'envoyer à lui-même
//     const userService = this.moduleRef.get(UserService);
//     const currentUser = await userService.getUserById(id_user);
    
//     if (currentUser && currentUser.telephone === payWithPhoneDto.telephone) {
//       throw new BadRequestException('Vous ne pouvez pas effectuer une transaction vers votre propre numéro');
//     }
    
//     const transaction = await this.transactionService.createTransactionFromPhone(
//       id_user,
//       payWithPhoneDto.telephone,
//       payWithPhoneDto.montant,
//       payWithPhoneDto.description
//     );
    
//     return {
//       success: true,
//       message: 'Transaction effectuée avec succès',
//       data: {
//         id_transaction: transaction.id_transaction,
//         montant_total: Number(transaction.montant),
//         frais: Number(transaction.frais_transaction),
//         montant_recu: Number(transaction.montant) - Number(transaction.frais_transaction),
//         statut: transaction.statut,
//         date_transaction: transaction.date_transaction
//       }
//     };
//   }

//   /**
//    * Récupère l'historique des transactions de l'utilisateur connecté
//    */
//   @Get('my-transactions')
//   @UseGuards(JwtAuthGuard)
//   async getMyTransactions(@Req() req) {
//     const id_user = req.user.id_user;
//     const transactions = await this.transactionService.getUserTransactions(id_user);
    
//     return {
//       success: true,
//       message: 'Historique des transactions récupéré avec succès',
//       data: transactions
//     };
//   }

//   /**
//    * Récupère les détails d'une transaction spécifique
//    */
//   @Get(':id')
//   @UseGuards(JwtAuthGuard)
//   async getTransactionById(@Param('id', ParseIntPipe) id: number) {
//     const transaction = await this.transactionService.getTransactionById(id);
    
//     return {
//       success: true,
//       message: 'Détails de la transaction récupérés avec succès',
//       data: transaction
//     };
//   }

//   /**
//    * Annule une transaction en attente
//    */
//   @Post(':id/cancel')
//   @UseGuards(JwtAuthGuard)
//   async cancelTransaction(@Param('id', ParseIntPipe) id: number) {
//     const transaction = await this.transactionService.cancelTransaction(id);
    
//     return {
//       success: true,
//       message: 'Transaction annulée avec succès',
//       data: transaction
//     };
//   }
// }