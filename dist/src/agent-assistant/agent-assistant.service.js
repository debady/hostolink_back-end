"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentAssistanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agent_assistance_entity_1 = require("./entities/agent-assistance.entity");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
let AgentAssistanceService = class AgentAssistanceService {
    constructor(agentAssistanceRepository, jwtService) {
        this.agentAssistanceRepository = agentAssistanceRepository;
        this.jwtService = jwtService;
    }
    async getAgentById(id) {
        const agent = await this.agentAssistanceRepository.findOne({ where: { id } });
        if (!agent) {
            throw new common_1.NotFoundException(`Agent d'assistance avec l'ID ${id} non trouvé`);
        }
        return agent;
    }
    async findByEmail(email) {
        return this.agentAssistanceRepository.findOne({ where: { email } });
    }
    async validateAgent(email, password) {
        const agent = await this.findByEmail(email);
        if (!agent) {
            return null;
        }
        if (agent.statut !== 'actif') {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, agent.mdp);
        if (!isPasswordValid) {
            return null;
        }
        return agent;
    }
    async login(agent) {
        const payload = { id: agent.id, email: agent.email, nom: agent.nom, prenom: agent.prenom };
        return {
            access_token: this.jwtService.sign(payload),
            agent: {
                id: agent.id,
                email: agent.email,
                nom: agent.nom,
                prenom: agent.prenom,
                urlPhotoAgent: agent.urlPhotoAgent,
            },
        };
    }
    async findAll() {
        return this.agentAssistanceRepository.find();
    }
    async findActive() {
        return this.agentAssistanceRepository.find({ where: { statut: 'actif' } });
    }
    async createAgent(createAgentDto) {
        const existingAgent = await this.findByEmail(createAgentDto.email);
        if (existingAgent) {
            throw new common_1.ConflictException(`Un agent avec l'email ${createAgentDto.email} existe déjà`);
        }
        const hashedPassword = await bcrypt.hash(createAgentDto.password, 10);
        const newAgent = this.agentAssistanceRepository.create({
            nom: createAgentDto.nom,
            prenom: createAgentDto.prenom,
            email: createAgentDto.email,
            telephone: createAgentDto.telephone,
            mdp: hashedPassword,
            urlPhotoAgent: createAgentDto.urlPhotoAgent,
            idAdminGestionnaire: createAgentDto.idAdminGestionnaire,
            statut: 'actif',
            dateCreation: new Date(),
            dateModification: new Date(),
        });
        return this.agentAssistanceRepository.save(newAgent);
    }
    async deactivateAgent(id) {
        const agent = await this.getAgentById(id);
        agent.statut = 'inactif';
        agent.dateModification = new Date();
        return this.agentAssistanceRepository.save(agent);
    }
    async activateAgent(id) {
        const agent = await this.getAgentById(id);
        agent.statut = 'actif';
        agent.dateModification = new Date();
        return this.agentAssistanceRepository.save(agent);
    }
};
exports.AgentAssistanceService = AgentAssistanceService;
exports.AgentAssistanceService = AgentAssistanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agent_assistance_entity_1.AgentAssistance)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AgentAssistanceService);
//# sourceMappingURL=agent-assistant.service.js.map