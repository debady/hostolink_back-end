import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'mdp_dev_sohapigroup',
  database: 'hostolink_bd',
  entities: [
    'src/**/*.entity.ts',
    
  ],
  synchronize: false,
  logging: true,

});