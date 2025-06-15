"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentAssistantModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const agent_assistant_service_1 = require("./agent-assistant.service");
const agent_assistant_controller_1 = require("./agent-assistant.controller");
const agent_assistance_entity_1 = require("./entities/agent-assistance.entity");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
let AgentAssistantModule = class AgentAssistantModule {
};
exports.AgentAssistantModule = AgentAssistantModule;
exports.AgentAssistantModule = AgentAssistantModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([agent_assistance_entity_1.AgentAssistance]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your_jwt_secret',
                signOptions: { expiresIn: '1d' },
            }),
            passport_1.PassportModule,
        ],
        controllers: [agent_assistant_controller_1.AgentAssistanceController],
        providers: [agent_assistant_service_1.AgentAssistanceService],
        exports: [agent_assistant_service_1.AgentAssistanceService],
    })
], AgentAssistantModule);
//# sourceMappingURL=agent-assistant.module.js.map