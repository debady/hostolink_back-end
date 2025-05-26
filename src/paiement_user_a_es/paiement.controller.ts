import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    BadRequestException,
    Get,
    Query,
  } from '@nestjs/common';
  import { PaiementService } from './paiement.service';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { PaiementDto } from './dto/paiement.dto';
  

@Controller('paiement')
export class PaiementController {
  constructor(private readonly paiementService: PaiementService) {}

  @UseGuards(JwtAuthGuard)
  @Get('infos-qr')
  async lireInfosParQr(@Query('token') token: string) {
    return this.paiementService.lireInfosParQr(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('vers-etablissement')
  async payerParQr(
    @Req() req: any,
    @Body() body: { shortId: string; idCompteEtablissement: number; montant: number },
  ) {
    // console.log('🔥 Reçu dans le body :', body);
    // console.log('🧪 Utilisateur authentifié =', req.user);
    // const idUser = req.user.id_user;
    const idUser = req.user.id_user ?? req.user.idUser ?? req.user.id; // sécurité max

    return this.paiementService.payerParQr(
      body.shortId,
      body.idCompteEtablissement,
      body.montant,
      idUser,
    );
  } 


  @UseGuards(JwtAuthGuard)
  @Post('vers-etablissement/email-ou-tel')
  async payerVersEtablissementParIdentifiant(
    @Body() body: { identifiant: string; montant: number },
    @Req() req,
  ) {
    return this.paiementService.payerParIdentifiant(
      body.identifiant,
      body.montant,
      req.user.id_user,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get('test-token')
  getTokenTest(@Req() req) {
    return {
      message: "Token valide",
      utilisateur: req.user,
    };
  }


}
