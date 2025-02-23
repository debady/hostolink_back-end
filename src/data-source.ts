import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost", // Mets ton IP locale si nécessaire, ex: "192.168.1.4"
  port: 5432,
  username: "postgres",
  password: "NGUESSAN",
  database: "hostolink_bd",
  entities: [User], // Utilisation directe des entités importées
  migrations: ["src/migrations/*.ts"], // Vérifie si tes migrations sont bien stockées ici
  synchronize: false, // Désactive synchronize si tu utilises des migrations
  logging: true, // Active les logs SQL pour voir ce qui se passe
});

