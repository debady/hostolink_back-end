import { Repository } from 'typeorm';
import { AgentAssistance } from './entities/agent-assistance.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateAgentDto } from './dto/agent.dto';
export declare class AgentAssistanceService {
    private agentAssistanceRepository;
    private jwtService;
    constructor(agentAssistanceRepository: Repository<AgentAssistance>, jwtService: JwtService);
    getAgentById(id: number): Promise<AgentAssistance>;
    findByEmail(email: string): Promise<AgentAssistance | null>;
    validateAgent(email: string, password: string): Promise<AgentAssistance | null>;
    login(agent: AgentAssistance): Promise<{
        access_token: string;
        agent: {
            id: number;
            email: string;
            nom: string;
            prenom: string;
            urlPhotoAgent: string;
        };
    }>;
    findAll(): Promise<AgentAssistance[]>;
    findActive(): Promise<AgentAssistance[]>;
    createAgent(createAgentDto: CreateAgentDto): Promise<AgentAssistance>;
    deactivateAgent(id: number): Promise<AgentAssistance>;
    activateAgent(id: number): Promise<AgentAssistance>;
}
