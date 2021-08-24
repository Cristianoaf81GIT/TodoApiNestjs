import { Test, TestingModule } from '@nestjs/testing';
import { getCustomRepositoryToken, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from '../entity/todo';
import { TodoService } from './todo.service';

const todoEntityList: TodoEntity[] = [
  new TodoEntity({ task: 'task-1', isDone: 0 }),
  new TodoEntity({ task: 'task-2', isDone: 0 }),
  new TodoEntity({ task: 'task-3', isDone: 0 }),
];

describe('TodoService', () => {
  let todoService: TodoService;
  let todoRepository: Repository<TodoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(todoEntityList),
            findOne: jest.fn(),
            save: jest.fn(),
            findOneOrFail: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    todoRepository = module.get<Repository<TodoEntity>>(
      getRepositoryToken(TodoEntity),
    );
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
    expect(todoRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return  a todo list entity successfylly', async () => {
      const result = await todoService.findAll();
      expect(result).toEqual(todoEntityList);
      expect(todoRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an error', () => {
      jest.spyOn(todoRepository, 'find').mockRejectedValueOnce(new Error());
      expect(todoService.findAll).rejects.toThrowError();
    });
  });
});
