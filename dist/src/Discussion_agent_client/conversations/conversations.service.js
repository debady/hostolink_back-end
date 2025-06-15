"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conversation_entity_1 = require("./entities/conversation.entity");
const message_assistant_client_entity_1 = require("../message_assistant_client/entities/message-assistant-client.entity");
const questions_predefinies_service_1 = require("../questions_predefinies/questions_predefinies.service");
const agent_assistant_service_1 = require("../../agent-assistant/agent-assistant.service");
const message_assistant_client_service_1 = require("../message_assistant_client/message_assistant_client.service");
let ConversationService = class ConversationService {
    constructor(conversationRepository, messageRepository, questionService, agentService, messageService) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.questionService = questionService;
        this.agentService = agentService;
        this.messageService = messageService;
    }
    async findAll() {
        return this.conversationRepository.find();
    }
    async findByUser(userId) {
        return this.conversationRepository.find({
            where: { userId },
            order: { startTime: 'DESC' },
        });
    }
    async findByEtablissementSante(etablissementSanteId) {
        return this.conversationRepository.find({
            where: { etablissementSanteId },
            order: { startTime: 'DESC' },
        });
    }
    async findByAssistant(assistantId) {
        return this.conversationRepository.find({
            where: { assistantId },
            order: { startTime: 'DESC' },
        });
    }
    async findOne(id) {
        const conversation = await this.conversationRepository.findOne({
            where: { id },
            relations: ['messages', 'messages.images', 'messages.questionSugerer'],
        });
        if (!conversation) {
            throw new common_1.NotFoundException(`Conversation avec l'ID ${id} non trouvée`);
        }
        return conversation;
    }
    async getActiveConversationForUser(userId) {
        return this.conversationRepository.findOne({
            where: { userId, status: 'active' },
            order: { startTime: 'DESC' },
        });
    }
    async getActiveConversationForEtablissement(etablissementSanteId) {
        return this.conversationRepository.findOne({
            where: { etablissementSanteId, status: 'active' },
            order: { startTime: 'DESC' },
        });
    }
    async getOrCreateConversation(userId, etablissementSanteId, assistantId, initialQuestionId) {
        let conversation = null;
        if (userId) {
            conversation = await this.getActiveConversationForUser(userId);
        }
        else if (etablissementSanteId) {
            conversation = await this.getActiveConversationForEtablissement(etablissementSanteId);
        }
        if (conversation) {
            return conversation;
        }
        if (etablissementSanteId) {
            try {
                const query = `SELECT COUNT(*) FROM user_etablissement_sante WHERE id_etablissement_sante = $1`;
                const result = await this.conversationRepository.query(query, [etablissementSanteId]);
                if (result[0].count === '0') {
                    throw new Error(`Établissement avec l'ID ${etablissementSanteId} non trouvé`);
                }
            }
            catch (error) {
                etablissementSanteId = undefined;
            }
        }
        if (!assistantId) {
            const activeAgents = await this.agentService.findActive();
            if (activeAgents.length === 0) {
                throw new Error('Aucun agent d\'assistance disponible');
            }
            assistantId = activeAgents[0].id;
        }
        const createDto = {
            userId,
            etablissementSanteId,
            assistantId,
            initialQuestionId
        };
        return this.create(createDto);
    }
    async create(createConversationDto) {
        const conversation = this.conversationRepository.create({
            userId: createConversationDto.userId,
            etablissementSanteId: createConversationDto.etablissementSanteId,
            assistantId: createConversationDto.assistantId,
            status: 'active',
        });
        const savedConversation = await this.conversationRepository.save(conversation);
        if (createConversationDto.initialQuestionId) {
            const question = await this.questionService.findOne(createConversationDto.initialQuestionId);
            const message = this.messageRepository.create({
                conversation: savedConversation,
                conversationId: savedConversation.id,
                envoyerPar: 'user',
                messageText: question.questionText,
                questionSugerer: question,
                questionSugererId: question.id,
                hasFile: false,
            });
            await this.messageRepository.save(message);
        }
        return this.findOne(savedConversation.id);
    }
    async update(id, updateConversationDto) {
        const conversation = await this.findOne(id);
        const updated = Object.assign(conversation, updateConversationDto);
        await this.conversationRepository.save(updated);
        return this.findOne(id);
    }
    async archive(id) {
        const conversation = await this.findOne(id);
        conversation.status = 'archived';
        await this.conversationRepository.save(conversation);
        return this.findOne(id);
    }
    async countByAssistant(assistantId) {
        return this.conversationRepository.count({
            where: { assistantId },
        });
    }
    async getActiveConversations() {
        return this.conversationRepository.find({
            where: { status: 'active' },
            order: { startTime: 'DESC' },
        });
    }
};
exports.ConversationService = ConversationService;
exports.ConversationService = ConversationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(1, (0, typeorm_1.InjectRepository)(message_assistant_client_entity_1.MessageAssistantClient)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => message_assistant_client_service_1.MessageService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        questions_predefinies_service_1.QuestionService,
        agent_assistant_service_1.AgentAssistanceService,
        message_assistant_client_service_1.MessageService])
], ConversationService);
//# sourceMappingURL=conversations.service.js.map