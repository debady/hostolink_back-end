import { Repository } from 'typeorm';
import { User } from 'src/utilisateur/entities/user.entity';
import { Administrateur } from 'src/administrateur/entities/administrateur.entity';
import { MessageThematique } from './entities/message_thematique.entity';
import { Thematique } from './entities/thematique.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateThematiqueDto } from './dto/create-thematique.dto';
import { RepondreMessageExpertDto } from './dto/reponse-message-expert.dto';
import { ExpertSante } from 'src/user_etablissement_sante/entities/expert_sante.entity';
export declare class ThematiqueDiscussionService {
    private readonly messageRepo;
    private readonly thematiqueRepo;
    private readonly userRepo;
    private readonly adminRepo;
    private readonly expertRepo;
    constructor(messageRepo: Repository<MessageThematique>, thematiqueRepo: Repository<Thematique>, userRepo: Repository<User>, adminRepo: Repository<Administrateur>, expertRepo: Repository<ExpertSante>);
    createMessage(dto: CreateMessageDto): Promise<MessageThematique>;
    getAllThematiques(): Promise<Thematique[]>;
    createThematique(dto: CreateThematiqueDto): Promise<Thematique>;
    getMessagesByThematique(id_thematique_discussion: number): Promise<any[]>;
    marquerMessagesCommeLus(id_thematique: number, id_user: string): Promise<void>;
    repondreEnTantQueExpert(dto: RepondreMessageExpertDto): Promise<MessageThematique>;
}
