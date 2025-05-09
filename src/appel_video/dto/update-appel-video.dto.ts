import { IsString, IsIn } from 'class-validator';

export class UpdateAppelStatusDto {
  @IsString()
  @IsIn(['en_attente', 'en_cours', 'termine'])
  status_appel: string;
}

