// import { OmitType, PartialType } from '@nestjs/swagger';
import { TodoEntity } from '../entity/todo';

// export class IndexTodoSwagger extends PartialType(
//   OmitType(TodoEntity, ['createdAt', 'deletetedAt', 'deletetedAt']),
// ) {}

export class IndexTodoSwagger extends TodoEntity {}
