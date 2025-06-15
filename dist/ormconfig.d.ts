declare const _default: {
    type: string;
    host: string | undefined;
    port: number;
    username: string | undefined;
    password: string | undefined;
    database: string | undefined;
    synchronize: boolean;
    logging: boolean;
    ssl: boolean | {
        rejectUnauthorized: boolean;
    };
    entities: string[];
    migrations: string[];
    cli: {
        migrationsDir: string;
    };
};
export default _default;
