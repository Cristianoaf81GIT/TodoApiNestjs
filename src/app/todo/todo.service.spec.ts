import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from '../entity/todo';
import { CreateTodoDto } from './dto/todo.dto';
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
            findOne: jest.fn().mockResolvedValue(todoEntityList[0]),
            save: jest.fn().mockResolvedValue(todoEntityList[0]),
            findOneOrFail: jest.fn().mockResolvedValue(todoEntityList[0]),
            softDelete: jest.fn(),
            create: jest.fn().mockReturnValue(todoEntityList[0]),
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
    it('should return  a todo list entity successfully', async () => {
      const result = await todoService.findAll();
      expect(result).toEqual(todoEntityList);
      expect(todoRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an error', () => {
      jest.spyOn(todoRepository, 'find').mockRejectedValueOnce(new Error());
      expect(todoService.findAll).rejects.toThrowError();
    });
  });

  describe('findOneOrFail', () => {
    it('should return a todo entity successfully', async () => {
      const result = await todoService.findOneOrFail('1');
      expect(result).toEqual(todoEntityList[0]);
      expect(todoRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });
    it('should throw a notFound exception', () => {
      jest
        .spyOn(todoRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());
      expect(todoService.findOneOrFail).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should return a new todo entity item successfuly', async () => {
      const data: CreateTodoDto = {
        task: 'task-1',
        isDone: 0,
      };
      const result = await todoService.create(data);
      expect(result).toEqual(todoEntityList[0]);
      expect(todoRepository.create).toHaveBeenCalledTimes(1);
      expect(todoRepository.save).toHaveBeenCalledTimes(1);
    });
    it('should  trhow an exception', () => {
      const data: CreateTodoDto = {
        task: 'task-1',
        isDone: 0,
      };
      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());
      expect(todoService.create(data)).rejects.toThrowError();
    });
  });
});
