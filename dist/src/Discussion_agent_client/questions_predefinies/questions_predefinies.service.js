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
exports.QuestionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const question_predefinie_entity_1 = require("./entities/question-predefinie.entity");
let QuestionService = class QuestionService {
    constructor(QuestionsPredefiniesRepository) {
        this.QuestionsPredefiniesRepository = QuestionsPredefiniesRepository;
    }
    async findAll() {
        return this.QuestionsPredefiniesRepository.find({ where: { isActive: true } });
    }
    async findAllAgent() {
        return this.QuestionsPredefiniesRepository.find();
    }
    async findByAssistant(assistantId) {
        return this.QuestionsPredefiniesRepository.find({
            where: { assistantId, isActive: true },
        });
    }
    async findByCategory(category) {
        return this.QuestionsPredefiniesRepository.find({
            where: { category, isActive: true },
        });
    }
    async findByAssistantAndCategory(assistantId, category) {
        return this.QuestionsPredefiniesRepository.find({
            where: { assistantId, category, isActive: true },
        });
    }
    async findOne(id) {
        const question = await this.QuestionsPredefiniesRepository.findOne({ where: { id } });
        if (!question) {
            throw new common_1.NotFoundException(`Question avec l'ID ${id} non trouvée`);
        }
        return question;
    }
    async create(createQuestionDto) {
        const question = this.QuestionsPredefiniesRepository.create(createQuestionDto);
        return this.QuestionsPredefiniesRepository.save(question);
    }
    async update(id, updateQuestionDto) {
        const question = await this.findOne(id);
        const updated = Object.assign(question, updateQuestionDto);
        return this.QuestionsPredefiniesRepository.save(updated);
    }
    async remove(id) {
        const question = await this.findOne(id);
        await this.QuestionsPredefiniesRepository.remove(question);
    }
    async toggleActive(id) {
        const question = await this.findOne(id);
        question.isActive = !question.isActive;
        return this.QuestionsPredefiniesRepository.save(question);
    }
};
exports.QuestionService = QuestionService;
exports.QuestionService = QuestionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(question_predefinie_entity_1.QuestionsPredefinies)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], QuestionService);
//# sourceMappingURL=questions_predefinies.service.js.map