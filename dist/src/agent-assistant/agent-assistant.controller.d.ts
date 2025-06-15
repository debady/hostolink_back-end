import { AgentAssistanceService } from './agent-assistant.service';
import { CreateAgentDto } from './dto/agent.dto';
import { LoginAgentDto } from './dto/login-agent.dto';
export declare class AgentAssistanceController {
    private readonly agentService;
    constructor(agentService: AgentAssistanceService);
    login(loginDto: LoginAgentDto): Promise<{
        access_token: string;
        agent: {
            id: number;
            email: string;
            nom: string;
            prenom: string;
            urlPhotoAgent: string;
        };
    }>;
    getProfile(req: any): any;
    createAgent(createAgentDto: CreateAgentDto, req: any): Promise<import("./entities/agent-assistance.entity").AgentAssistance>;
    deactivateAgent(id: string): Promise<import("./entities/agent-assistance.entity").AgentAssistance>;
    activateAgent(id: string): Promise<import("./entities/agent-assistance.entity").AgentAssistance>;
    findAll(): Promise<import("./entities/agent-assistance.entity").AgentAssistance[]>;
    findActive(): Promise<import("./entities/agent-assistance.entity").AgentAssistance[]>;
    findOne(id: string): Promise<import("./entities/agent-assistance.entity").AgentAssistance>;
}
