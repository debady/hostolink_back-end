import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "NGUESSAN",
    database: "hostolink_bds_reviser_toutes",
    synchronize: true,

    logging: true,
    entities: ["src/**/entities/*.ts"],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});
