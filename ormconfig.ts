import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'NGUESSAN',
  database: 'hostolink_bds_reviser_toutes',
  entities: [
    'src/**/*.entity.ts',
    
  ],
  synchronize: false,
  logging: true,

});