import { Controller, Get, NotFoundException, Query, Req, UseGuards } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('invitation')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('code')
  async getOrCreateInvitation(@Req() request: Request) {
    const user = request.user as { id_user: string };
    const result = await this.invitationService.getOrCreateInvitation(user.id_user);
    return {
      success: true,
      code_invitation: result.code,
      lien_invitation: result.lien,
    };
  }

  @Get('tracking')
  async enregistrerClicInvitation(
    @Query('code') code: string,
    @Req() req: Request,
  ) {
    if (!code) {
      throw new NotFoundException('Code d\'invitation manquant dans la requête');
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || 'IP inconnue';
    const userAgent = req.headers['user-agent'] || 'Navigateur inconnu';

    await this.invitationService.enregistrerClic(code, ip.toString(), userAgent);

    return { success: true, message: 'Clic enregistré avec succès' };
  }
}

