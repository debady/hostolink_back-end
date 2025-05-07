import { Controller, Post, UseGuards, UseInterceptors, UploadedFiles, Body, Req, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentsIdentiteService } from './documents_identite.service';
import { CreateDocumentsIdentiteDto } from './dto/create-documents-identite.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('documents-identite')
export class DocumentsIdentiteController {
  constructor(private readonly documentsIdentiteService: DocumentsIdentiteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'recto', maxCount: 1 },
    { name: 'verso', maxCount: 1 },
    { name: 'photo_profile', maxCount: 1 },
  ]))
  async createDocument(
    @Req() req,
    @UploadedFiles() files: { recto?: Express.Multer.File[]; verso?: Express.Multer.File[]; photo_profile?: Express.Multer.File[] },
    @Body() createDto: CreateDocumentsIdentiteDto,
  ) {
    if (!files || (!files.recto && !files.photo_profile)) {
      throw new BadRequestException('Aucun fichier téléchargé.');
    }

    const recto = files.recto ? files.recto[0] : undefined;
    const verso = files.verso ? files.verso[0] : undefined;
    const photo_profile = files.photo_profile ? files.photo_profile[0] : undefined;

    if (!recto || !photo_profile) {
      throw new BadRequestException('Les fichiers recto et photo de profil sont obligatoires.');
    }

    return this.documentsIdentiteService.createDocument(req.user.id_user, createDto, {
      recto,
      verso,
      photo_profile,
    });
  }
}
