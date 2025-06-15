"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppelVideoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const appel_video_controller_1 = require("./appel_video.controller");
const appel_video_service_1 = require("./appel_video.service");
const appel_video_entity_1 = require("./entities/appel_video.entity");
const expert_sante_entity_1 = require("../user_etablissement_sante/entities/expert_sante.entity");
const user_entity_1 = require("../utilisateur/entities/user.entity");
const disponibilite_expert_entity_1 = require("./entities/disponibilite_expert.entity");
let AppelVideoModule = class AppelVideoModule {
};
exports.AppelVideoModule = AppelVideoModule;
exports.AppelVideoModule = AppelVideoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                appel_video_entity_1.AppelVideo,
                user_entity_1.User,
                disponibilite_expert_entity_1.DisponibiliteExpert,
                expert_sante_entity_1.ExpertSante,
            ]),
        ],
        controllers: [appel_video_controller_1.AppelVideoController],
        providers: [appel_video_service_1.AppelVideoService],
    })
], AppelVideoModule);
//# sourceMappingURL=appel_video_module.js.map