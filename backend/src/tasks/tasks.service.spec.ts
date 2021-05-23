import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/task.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = {id:1, username: 'Test User'}
const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn()
}); 

describe('TasksService',()=>{
  let tasksService;
  let taskRepository;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {provide: TaskRepository, useFactory: mockTaskRepository}
      ]
    }).compile();
    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks',()=>{
    it('get all tasks from repository',async() => {
      taskRepository.getTasks.mockResolvedValue('some value');
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const taskFilterDto:GetTaskFilterDto = {status:TaskStatus.OPEN, search: 'some search value'};
      const result = await tasksService.getTasks(taskFilterDto,mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('some value');
    })
  });

  describe('getTaskById',() => {
    it('calls taskRepository.findOne() and succesfully retrieve and return the task', async() => {
      const mockTask = {title: 'Test task',description: 'Test description'};
      taskRepository.findOne.mockResolvedValue(mockTask);
      const found = await tasksService.getTaskById(1,mockUser);
      expect(found).toEqual(mockTask);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {id: 1, userId: mockUser.id}
      });
    });

    it('throws an error as task is not found', async() => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1,mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTask',()=>{
    it('calls taskRepository.createTask() and successfully return the created task', async() => {
      taskRepository.createTask.mockResolvedValue('mock task');

      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const createTaskDto:CreateTaskDto = {title: 'Task title', description: 'task description'};
      const result = await tasksService.createTask(createTaskDto,mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto,mockUser);
      expect(result).toEqual('mock task');
    });
  });

  describe('deleteTask',()=>{
    it('calls taskRepository.deleteTask() to delete a task', async() => {
      taskRepository.delete.mockResolvedValue({affected:1});
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTask(1,mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({id:1,userId:mockUser.id});
    })

    it('throws an errror as task could not be found', () => {
      taskRepository.delete.mockResolvedValue({affected:0});
      expect(tasksService.deleteTask(1,mockUser)).rejects.toThrow(NotFoundException);
    })
  })

  describe('updateTaskStatus',() => {
    it('update a task status',async()=>{
      const save = jest.fn().mockResolvedValue(true);
  
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save
      })
  
      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser);
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    })
  })
})