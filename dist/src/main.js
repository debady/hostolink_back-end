"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
        app.enableCors({
            origin: '*',
            methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        });
        const PORT = process.env.PORT || 10000;
        await app.listen(PORT, '0.0.0.0');
        console.log(`🚀 le Server Tourne sur le port : http://localhost:${PORT}`);
    }
    catch (error) {
        console.error('❌ erreur lors du demarrage de l application', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map