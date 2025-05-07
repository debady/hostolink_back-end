import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsIdentiteEntity } from './entities/documents_identite.entity';
import { DocumentsIdentiteService } from './documents_identite.service';
import { DocumentsIdentiteController } from './documents_identite.controller';
import { CloudinaryService } from '../../config/cloudinary.config';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentsIdentiteEntity])],
  providers: [DocumentsIdentiteService, CloudinaryService],
  controllers: [DocumentsIdentiteController],
  exports: [DocumentsIdentiteService],
})
export class DocumentsIdentiteModule {}
