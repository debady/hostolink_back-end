export class ResponseListeNumeroVertEtablissementSanteDto {
    id_liste_num_etablissement_sante: number;
    id_admin_gestionnaire?: number | null;  // ✅ Correction ici
    contact: string;
    image: string;
    nom_etablissement: string;
    presentation?: string;
    adresse?: string;
    latitude?: number;
    longitude?: number;
    site_web?: string;
    type_etablissement: string;
    categorie: string;
    created_at?: Date;
  }
  