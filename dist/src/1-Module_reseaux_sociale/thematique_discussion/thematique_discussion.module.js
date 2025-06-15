"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThematiqueDiscussionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const thematique_discussion_controller_1 = require("./thematique_discussion.controller");
const thematique_entity_1 = require("./entities/thematique.entity");
const user_entity_1 = require("../../utilisateur/entities/user.entity");
const administrateur_entity_1 = require("../../administrateur/entities/administrateur.entity");
const message_thematique_entity_1 = require("./entities/message_thematique.entity");
const thematique_message_service_1 = require("./thematique_message.service");
const expert_sante_entity_1 = require("../../user_etablissement_sante/entities/expert_sante.entity");
const upload_controller_1 = require("./image/upload.controller");
const claudinary_service_1 = require("./image/claudinary.service");
let ThematiqueDiscussionModule = class ThematiqueDiscussionModule {
};
exports.ThematiqueDiscussionModule = ThematiqueDiscussionModule;
exports.ThematiqueDiscussionModule = ThematiqueDiscussionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                thematique_entity_1.Thematique,
                message_thematique_entity_1.MessageThematique,
                user_entity_1.User,
                administrateur_entity_1.Administrateur,
                expert_sante_entity_1.ExpertSante,
            ]),
        ],
        controllers: [thematique_discussion_controller_1.ThematiqueDiscussionController, upload_controller_1.UploadController,],
        providers: [thematique_message_service_1.ThematiqueDiscussionService, claudinary_service_1.CloudinaryService],
    })
], ThematiqueDiscussionModule);
//# sourceMappingURL=thematique_discussion.module.js.map