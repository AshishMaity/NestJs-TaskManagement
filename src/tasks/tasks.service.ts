import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService');

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository:TaskRepository
  ){

  }

  getTasks(filterDto:GetTaskFilterDto,user:User): Promise<Task[]>{
    this.logger.verbose(`User ${user.username} retrieving tasks. Filters: ${JSON.stringify(filterDto)}`);
    return this.taskRepository.getTasks(filterDto,user);
  }
  
  async getTaskById(id:number,user:User): Promise<Task>{
    this.logger.verbose(`User ${user.username} updating task. Task ID: ${id}`);
    const found =  await this.taskRepository.findOne({where: {id: id, userId: user.id}});
    if(!found){
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    this.logger.log(`Task with ID ${id} found`);
    return found;
  }

  async createTask(createTaskDto:CreateTaskDto,user:User): Promise<Task>{
    this.logger.verbose(`User ${user.username} creating task. Task creation DTO: ${createTaskDto}`);
    return await this.taskRepository.createTask(createTaskDto,user);
  }

  async deleteTask(id:number,user:User): Promise<void>{
    this.logger.verbose(`User ${user.username} deleting task. Task ID: ${id}`);
    const result = await this.taskRepository.delete({id:id, userId: user.id});
    if(result.affected === 0) throw new NotFoundException(`Task with ID ${id} not found`); 
  }

  async updateTaskStatus(id:number,status:TaskStatus,user:User): Promise<Task>{
    this.logger.verbose(`User ${user.username} updating task status. Task ID: ${id} and status:${status}`);
    const task = await this.getTaskById(id,user);
    task.status = status;
    try{
      await task.save();
    }catch(error){
      this.logger.error(`Error while updating task status.`,error.stack);
      throw new InternalServerErrorException();
    }
    return task;
  }

}
