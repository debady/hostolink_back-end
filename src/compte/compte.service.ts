// Service Compte
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Compte } from './entitie/compte.entity';

@Injectable()
export class CompteService {
  constructor(
    @InjectRepository(Compte)
    private compteRepository: Repository<Compte>,
  ) {}

  async createEtablissementCompte(etablissementId: number) {
    // Vérifier si un compte existe déjà
    const existingCompte = await this.compteRepository.findOne({
      where: { id_user_etablissement_sante: etablissementId }
    });

    if (existingCompte) {
      return existingCompte;
    }

    // Créer un nouveau numéro de compte unique
    const numeroCompte = 'ES' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);

    const newCompte = this.compteRepository.create({
      id_user_etablissement_sante: etablissementId,
      type_user: 'etablissement',
      devise: 'XAF', // CFA
      numero_compte: numeroCompte,
      solde_compte: 0,
    });

    return this.compteRepository.save(newCompte);
  }

  async findCompteByEtablissement(etablissementId: number) {
    const compte = await this.compteRepository.findOne({
      where: { id_user_etablissement_sante: etablissementId }
    });

    if (!compte) {
      throw new NotFoundException(`Compte pour l'établissement #${etablissementId} non trouvé`);
    }

    return compte;
  }

  async findCompteById(compteId: number) {
    const compte = await this.compteRepository.findOne({
      where: { id_compte: compteId }
    });

    if (!compte) {
      throw new NotFoundException(`Compte #${compteId} non trouvé`);
    }

    return compte;
  }

  async updateSolde(compteId: number, montant: number) {
    const compte = await this.findCompteById(compteId);
    
    compte.solde_compte += montant;
    compte.date_modification = new Date();
    
    return this.compteRepository.save(compte);
  }
}