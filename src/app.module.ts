import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TodoModule } from './app/todo/todo.module';
import { TypeOrmConfigClass } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigClass,
    }),
    TodoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
