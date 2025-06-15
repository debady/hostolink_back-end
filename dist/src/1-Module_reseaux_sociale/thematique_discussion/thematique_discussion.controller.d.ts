import { CreateThematiqueDto } from './dto/create-thematique.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ThematiqueDiscussionService } from './thematique_message.service';
import { RepondreMessageExpertDto } from './dto/reponse-message-expert.dto';
export declare class ThematiqueDiscussionController {
    private readonly thematiqueService;
    constructor(thematiqueService: ThematiqueDiscussionService);
    createThematique(dto: CreateThematiqueDto): Promise<import("./entities/thematique.entity").Thematique>;
    getAllThematiques(): Promise<import("./entities/thematique.entity").Thematique[]>;
    createMessage(dto: CreateMessageDto): Promise<import("./entities/message_thematique.entity").MessageThematique>;
    getMessagesByThematique(id: number): Promise<any[]>;
    repondreEnTantQueExpert(dto: RepondreMessageExpertDto): Promise<import("./entities/message_thematique.entity").MessageThematique>;
    markMessagesAsRead(id: number, id_user: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
