import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";
import { Otp } from "./otp/entities/otp.entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "NGUESSAN",
    database: "hostolink_bds",
    synchronize: true,

    logging: true,
    entities: ["src/**/entities/*.ts"],
    // entities: [User, Otp], 
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});
