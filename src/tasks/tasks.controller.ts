import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/task.dto';
import { TaskStatusValidation } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService:TasksService){
  }

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTaskFilterDto,
    @GetUser() user:User
    ){
    return this.taskService.getTasks(filterDto,user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id',ParseIntPipe) id:number,
    @GetUser() user:User
    ): Promise<Task> {
    return this.taskService.getTaskById(id,user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() creatTaskDto: CreateTaskDto,
    @GetUser() user:User
    ): Promise<Task>{
    return this.taskService.createTask(creatTaskDto,user);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id',ParseIntPipe) id:number,
    @GetUser() user:User
    ): Promise<void> {
    return this.taskService.deleteTask(id,user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id:number,
    @Body('status',TaskStatusValidation) status: TaskStatus,
    @GetUser() user:User
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id,status,user);
  }



}
