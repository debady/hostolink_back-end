import { Controller, Post, Body } from '@nestjs/common';
import { AppelVideoService } from './appel_video.service';
import { CreateAppelDto } from './dto/create-appel.dto';
import { AppelVideo } from './entities/appel_video.entity';

@Controller('appel-video')
export class AppelVideoController {
  constructor(private readonly appelService: AppelVideoService) {}

  @Post('lancer')
  async lancerAppel(@Body() dto: CreateAppelDto): Promise<AppelVideo> {
    return this.appelService.lancerAppel(dto);
  }
}

