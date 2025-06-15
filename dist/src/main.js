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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const express_1 = require("express");
const path_1 = require("path");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        app.use((0, express_1.json)());
        app.use((0, express_1.urlencoded)({ extended: true }));
        app.enableCors({
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: process.env.CORS_CREDENTIALS === 'true',
        });
        if (process.env.SERVE_STATIC === 'true') {
            app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
        }
        const PORT = process.env.PORT || 3000;
        await app.listen(PORT, '0.0.0.0');
        console.log(`🚀 Le serveur tourne sur : http://localhost:${PORT}`);
        console.log('📦 Connexion à PostgreSQL :', process.env.DATABASE_NAME);
    }
    catch (error) {
        console.error('❌ Erreur lors du démarrage de l’application :', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map