import { IsNotEmpty, IsString, IsNumber, IsUUID, Min, Matches, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePayoutDto {
  @IsNotEmpty({ message: 'Le montant est requis' })
  @IsNumber({}, { message: 'Le montant doit être un nombre' })
  @Min(100, { message: 'Le montant minimum est de 100 XOF' })
  @Transform(({ value }) => parseInt(value))
  amount: number;

  @IsNotEmpty({ message: 'Le numéro Wave est requis' })
  @IsString({ message: 'Le numéro Wave doit être une chaîne' })
  @Matches(/^\+225\d{8,10}$/, { message: 'Format de numéro Wave invalide (+225xxxxxxxx)' })
  numero_wave: string;
}

export class ConfigureWaveDto {
  @IsNotEmpty({ message: 'Le numéro Wave est requis' })
  @IsString({ message: 'Le numéro Wave doit être une chaîne' })
  @Matches(/^\+225\d{8,10}$/, { message: 'Format de numéro Wave invalide (+225xxxxxxxx)' })
  numero_wave: string;
}

export class VerifyWaveOtpDto {
  @IsNotEmpty({ message: 'Le code OTP est requis' })
  @IsString({ message: 'Le code OTP doit être une chaîne' })
  @Length(4, 4, { message: 'Le code OTP doit contenir exactement 4 chiffres' })
  @Matches(/^\d{4}$/, { message: 'Le code OTP doit contenir uniquement des chiffres' })
  otp_code: string;
}

export class PayoutResponseDto {
  success: boolean;
  message: string;
  data?: {
    payoutId: string;
    idempotencyKey: string;
    amount: string;
    currency: string;
    mobile: string;
    status: string;
    createdAt: Date;
  };
  error?: string;
}

export class PayoutStatusDto {
  success: boolean;
  data?: {
    payoutId: string;
    status: string;
    amount: string;
    currency: string;
    waveStatus: string;
    waveFee: string;
    waveTimestamp: Date;
    isCompleted: boolean;
  };
  error?: string;
}

export class WaveConfigResponseDto {
  success: boolean;
  message: string;
  data?: {
    message: string;
    numero_wave: string;
    wave_verified: boolean;
    otp_sent?: boolean;
    expires_in_minutes?: number;
  };
  error?: string;
}