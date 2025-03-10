"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const express_1 = require("express");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    if (process.env.SERVE_STATIC === 'true') {
        app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    }
    app.use((0, express_1.json)());
    app.use((0, express_1.urlencoded)({ extended: true }));
    app.enableCors({
        origin: '*',
        methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT, '0.0.0.0');
    console.log(`le server tourne bien sur le porte 🚀: http://localhost:${PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map