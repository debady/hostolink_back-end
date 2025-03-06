
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
  username: 'dev_sohapigroup',
  password: 'mdp_dev_sohapigroup',
  database: 'hostolink_bd',
  entities: [
    'dist/**/*.entity{.ts,.js}'
  ],
  synchronize: true,
});