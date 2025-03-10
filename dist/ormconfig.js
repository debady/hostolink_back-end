"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'dev_sohapigroup',
    password: 'mdp_dev_sohapigroup',
    database: 'hostolink_bd',
    entities: [
        'dist/**/*.entity{.ts,.js}'
    ],
    synchronize: true,
});
//# sourceMappingURL=ormconfig.js.map