import { IsString } from 'class-validator';

export class CreateDocumentsIdentiteDto {
  @IsString()
  type_document: string;
}
