import { IsUUID, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateAppelDto {
  @IsUUID()
  id_user: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  urgence_type?: string;
}
