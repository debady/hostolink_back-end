import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "NGUESSAN",
    database: "hostolink_bd",
    synchronize: true,

    logging: true,
    entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});
