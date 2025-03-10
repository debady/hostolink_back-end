"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "NGUESSAN",
    database: "hostolink_bd",
    synchronize: true,
    logging: true,
    entities: ["src/**/entities/*.ts"],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map