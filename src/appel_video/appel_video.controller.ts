import { Controller, Post, Body, Param, Get, Patch, Delete } from '@nestjs/common';
import { AppelVideoService } from './appel_video.service';
import { CreateAppelDto } from './dto/create-appel.dto';
import { AppelVideo } from './entities/appel_video.entity';
import { TerminerAppelDto } from './dto/terminer-appel.dto';
import { UpdateAppelStatusDto } from './dto/update-appel-video.dto';
import { MajDisponibiliteDto } from './dto/disponibilite-expert.dto';
import { RefusAppelDto } from './dto/refuse-appel_video.dto';


@Controller('appel-video')
export class AppelVideoController {
  constructor(private readonly appelService: AppelVideoService,
  ) {}

  @Post('lancer')
  async lancerAppel(@Body() dto: CreateAppelDto): Promise<AppelVideo> {
    return this.appelService.lancerAppel(dto);
  }

 
  @Post('terminer/:id_appel')
  async terminerAppel(
  @Param('id_appel') id_appel: string,
  @Body() dto: TerminerAppelDto,
) {
  return this.appelService.terminerAppel(id_appel, dto);
}

@Get('actif/:id_user')
async verifierAppelActif(@Param('id_user') id_user: string) {
  return this.appelService.verifierAppelActif(id_user.trim());
}

@Get('historique/:id_user')
async historiqueAppels(@Param('id_user') id_user: string) {
  return this.appelService.historiqueAppels(id_user.trim());
}

@Patch('status/:id_appel')
async changerStatus(
@Param('id_appel') id_appel: string,
  @Body() dto: UpdateAppelStatusDto,
) {
  return this.appelService.changerStatusAppel(id_appel.trim(), dto);
}

@Delete(':id_appel')
async annulerAppel(@Param('id_appel') id_appel: string) {
  return this.appelService.annulerAppel(id_appel.trim());
}


@Post('disponibilite/:id_expert')
async mettreAJourDispo(
  @Param('id_expert') id_expert: number,
  @Body() dto: MajDisponibiliteDto,
) {
  return this.appelService.mettreAJourDisponibilite(id_expert, dto);
}

@Get('disponibles')
async listerExpertsConnectes() {
  return this.appelService.listerExpertsDisponibles();
}

@Get('en-attente/:id_expert')
async getAppelsEnAttente(@Param('id_expert') id_expert: number) {
  return this.appelService.appelsEnAttentePourExpert(id_expert);
}

@Post('accepter/:id_appel')
async accepterAppel(@Param('id_appel') id_appel: string) {
  return this.appelService.accepterAppel(id_appel.trim());
}


@Post('terminer-par-expert/:id_appel')
async terminerParExpert(
  @Param('id_appel') id_appel: string,
  @Body() dto: TerminerAppelDto,
) {
  return this.appelService.terminerAppelParExpert(id_appel.trim(), dto);
}


@Get('historique-expert/:id_expert')
async getHistoriqueExpert(@Param('id_expert') id_expert: number) {
  return this.appelService.historiqueAppelsExpert(id_expert);
}

@Patch('refuser/:id_appel')
async refuserAppel(
  @Param('id_appel') id_appel: string,
  @Body() dto: RefusAppelDto,
) {
  return this.appelService.refuserAppel(id_appel.trim(), dto);
}


@Get('en-cours/:id_expert')
async verifierAppelEnCours(@Param('id_expert') id_expert: number) {
  return this.appelService.verifierAppelEnCoursPourExpert(id_expert);
}

}
