import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { TodoEntity } from 'src/app/entity/todo';

@Injectable()
export class TypeOrmConfigClass implements TypeOrmOptionsFactory {
  config: TypeOrmModuleOptions = {
    type: 'mariadb',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [TodoEntity],
    synchronize: true,
  };
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return this.config;
  }
}
