import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'NGUESSAN',
  database: 'hostolink_bd',
  entities: [
    'dist/**/*.entity{.ts,.js}'
  ],
  synchronize: true,
});