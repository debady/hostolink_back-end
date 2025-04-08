import { Controller, Post, Body } from '@nestjs/common';
import { UserEtablissementSanteService } from './user-etablissement-sante.service';
import { CreateUserEtablissementDto } from './dto/create-user-etablissement.dto';

@Controller('user-etablissement-sante')
export class UserEtablissementSanteController {
  constructor(private readonly service: UserEtablissementSanteService) {}

  @Post('register')
  register(@Body() dto: CreateUserEtablissementDto) {
    return this.service.register(dto);
  }

  @Post('verify-otp')
  verify(@Body() body: { email: string; code: string }) {
    return this.service.verifyOtp(body.email, body.code);
  }
}
