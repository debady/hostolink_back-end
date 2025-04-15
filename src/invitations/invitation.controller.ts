import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
}

