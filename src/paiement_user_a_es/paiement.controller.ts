import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    BadRequestException,
  } from '@nestjs/common';
  import { PaiementService } from './paiement.service';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { PaiementDto } from './dto/paiement.dto';
  
  @Controller('paiement')
  export class PaiementController {
    constructor(private readonly paiementService: PaiementService) {}
  
    // 🔒 Paiement d’un utilisateur vers un établissement par scan QR dynamique
    @UseGuards(JwtAuthGuard)
    @Post('vers-etablissement')
    async payerParQr(@Req() req: any, @Body() dto: PaiementDto) {
      const idUser = req.user.id_user;
  
      if (!dto.token || !dto.montant) {
        throw new BadRequestException('Token et montant requis');
      }
  
      return this.paiementService.payerParQr(dto.token, dto.montant, idUser);
    }
  }
  