import { Controller, Post, UseGuards, UseInterceptors, UploadedFiles, Body, Req, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentsIdentiteService } from './documents_identite.service';
import { CreateDocumentsIdentiteDto } from './dto/create-documents-identite.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('documents-identite')
export class DocumentsIdentiteController {
  constructor(private readonly documentsIdentiteService: DocumentsIdentiteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async createDocument(
    @Req() req,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createDto: CreateDocumentsIdentiteDto,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Aucun fichier téléchargé.');
    }

    // Extract files by fieldname
    const recto = files.find(file => file.fieldname === 'recto');
    const verso = files.find(file => file.fieldname === 'verso');
    const photo_profile = files.find(file => file.fieldname === 'photo_profile');

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
