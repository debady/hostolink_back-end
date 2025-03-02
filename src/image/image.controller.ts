import { Controller, Post, Get, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const image = await this.imageService.uploadImage(file);
    return { success: true, image };
  }

  @Get(':id')
  async getImage(@Param('id') id: string) {
    return await this.imageService.getImageById(id);
  }

  @Get()
  async getAllImages() {
    return await this.imageService.getAllImages();
  }



}
