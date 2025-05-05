import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentsIdentiteEntity } from './documents_identite.entity';
import { CloudinaryService } from '../../config/cloudinary.config';
import { CreateDocumentsIdentiteDto } from './dto/create-documents-identite.dto';

@Injectable()
export class DocumentsIdentiteService {
  constructor(
    @InjectRepository(DocumentsIdentiteEntity)
    private documentsIdentiteRepository: Repository<DocumentsIdentiteEntity>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createDocument(
    id_user: string,
    createDto: CreateDocumentsIdentiteDto,
    files: { recto?: Express.Multer.File; verso?: Express.Multer.File; photo_profile: Express.Multer.File },
  ): Promise<DocumentsIdentiteEntity> {
    // Check if user already has a document not rejected
    const existingDoc = await this.documentsIdentiteRepository.findOne({
      where: { id_user, statut_validation: 'en_attente' },
    });

    if (existingDoc) {
      throw new ConflictException('Un document est déjà en attente de validation.');
    }

    // Upload images to Cloudinary
    const url_recto = files.recto ? await this.cloudinaryService.uploadImage(files.recto) : undefined;
    const url_verso = files.verso ? await this.cloudinaryService.uploadImage(files.verso) : undefined;
    const url_photo_profile = await this.cloudinaryService.uploadImage(files.photo_profile);

    if (!url_recto || !url_photo_profile) {
      throw new BadRequestException('Les images recto et photo de profil sont obligatoires.');
    }

    // Create and save document record
    const document = this.documentsIdentiteRepository.create({
      id_user: id_user,
      type_document: createDto.type_document,
      url_recto: url_recto,
      url_verso: url_verso,
      url_photo_profile: url_photo_profile,
      statut_validation: 'en_attente',
    });

    return this.documentsIdentiteRepository.save(document);
  }
}
