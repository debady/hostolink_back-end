// src/compte/compte.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Compte } from './entitie/compte.entity';
import { CreateCompteDto } from './dto/compte.dto';

@Injectable()
export class CompteService {
  constructor(
    @InjectRepository(Compte)
    private compteRepository: Repository<Compte>,
  ) {}

  async create(createCompteDto: CreateCompteDto) {
    // Vérifier que l'un des deux ID est fourni
    if (!createCompteDto.id_user && !createCompteDto.id_user_etablissement_sante) {
      throw new BadRequestException('L\'identifiant de l\'utilisateur ou de l\'établissement est requis');
    }

    // Vérifier qu'un compte n'existe pas déjà
    const existingCompte = await this.compteRepository.findOne({
      where: [
        { id_user: createCompteDto.id_user },
        { id_user_etablissement_sante: createCompteDto.id_user_etablissement_sante }
      ]
    });

    if (existingCompte) {
      throw new BadRequestException('Un compte existe déjà pour cet utilisateur ou établissement');
    }

    // Générer un numéro de compte unique
    let numeroCompte: string;
    if (createCompteDto.type_user === 'utilisateur') {
      numeroCompte = 'USR-' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);
    } else {
      numeroCompte = 'ETB-' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);
    }

    const newCompte = this.compteRepository.create({
      ...createCompteDto,
      numero_compte: numeroCompte
    });

    return this.compteRepository.save(newCompte);
  }

  async findAll() {
    return this.compteRepository.find();
  }

  async findCompteById(id: number) {
    const compte = await this.compteRepository.findOne({
      where: { id_compte: id }
    });

    if (!compte) {
      throw new NotFoundException(`Compte avec ID ${id} non trouvé`);
    }

    return compte;
  }

  async findCompteByUser(userId: string) {
    const compte = await this.compteRepository.findOne({
      where: { id_user: userId }
    });

    if (!compte) {
      throw new NotFoundException(`Compte pour l'utilisateur avec ID ${userId} non trouvé`);
    }

    return compte;
  }

  async findCompteByEtablissement(etablissementId: number) {
    const compte = await this.compteRepository.findOne({
      where: { id_user_etablissement_sante: etablissementId }
    });

    if (!compte) {
      throw new NotFoundException(`Compte pour l'établissement avec ID ${etablissementId} non trouvé`);
    }

    return compte;
  }

  async updateSolde(compteId: number, montant: number) {
    const compte = await this.findCompteById(compteId);
    
    // Vérifier si le solde sera négatif après mise à jour
    if (compte.solde_compte + montant < 0) {
      throw new BadRequestException('Solde insuffisant pour cette opération');
    }
    
    compte.solde_compte += montant;
    compte.date_modification = new Date();
    
    return this.compteRepository.save(compte);
  }

  async remove(id: number) {
    const compte = await this.findCompteById(id);
    return this.compteRepository.remove(compte);
  }
}