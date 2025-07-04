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
exports.EmailController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const dream_houses_email_service_1 = require("./dream-houses-email.service");
const dreams_houses_send_mail_dto_1 = require("./dto/dreams-houses-send-mail.dto");
let EmailController = class EmailController {
    constructor(emailService) {
        this.emailService = emailService;
    }
    async envoyer(body, file) {
        let imageUrl = body.imageUrl;
        if (file) {
            imageUrl = await this.emailService.uploadImageFromBuffer(file.buffer);
        }
        else {
        }
        await this.emailService.sendCustomEmail({ ...body, imageUrl });
        return {
            success: true,
            message: '📩 Email envoyé avec succès',
        };
    }
};
exports.EmailController = EmailController;
__decorate([
    (0, common_1.Post)('envoyer'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dreams_houses_send_mail_dto_1.SendMailDto, Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "envoyer", null);
exports.EmailController = EmailController = __decorate([
    (0, common_1.Controller)('email'),
    __metadata("design:paramtypes", [dream_houses_email_service_1.EmailService])
], EmailController);
//# sourceMappingURL=dreams-houses-email.controller.js.map