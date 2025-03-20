
  // {
  //   "type": "postgres",
  //   "host": "localhost",
  //   "port": 5432,
  //   "username": "dev_sohapigroup",
  //   "password": "mdp_dev_sohapigroup",
  //   "database": "hostolink_bd",
  //   "entities": [
  //     "dist/**/*.entity{.ts,.js}"
  //   ],
  //   "synchronize": true
  // }

import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'NGUESSAN',
  database: 'hostolink_bds',
  entities: [
    'src/**/*.entity.ts',
    
  ],
  synchronize: false,
  logging: true,

});