import { DataSource } from 'typeorm';

export const devDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: ['dist/src/entity/**/*.js'],
  migrations: ['dist/src/migrations/*.js'],
  subscribers: ['dist/src/subscriber/**/*.js'],
});

devDataSource
  .initialize()
  .then(() => console.log('Data Source Iniciado'))
  .catch((e) => console.log(e));
