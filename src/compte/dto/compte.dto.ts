

export class CreateCompteDto {
  solde_compte?: number;
  solde_bonus?: number;
  cumule_mensuel?: number;
  plafond?: number;
  mode_paiement_preferentiel?: string;
  type_user: string;
  devise?: string;
  id_user?: string;
  id_user_etablissement_sante?: number;
}

export class UpdateModePaiementDto {
  mode_paiement_preferentiel: string;
}