
import { IsString, IsIn } from 'class-validator';

export class UpdateTransactionStatusDto {
  @IsString()
  @IsIn(['en_attente', 'validé', 'échoué', 'en_cours', 'remboursé', 'annulé'])
  statut: string;
}
