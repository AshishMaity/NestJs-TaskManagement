import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { CreatTaskDto } from './dto/task.dto';
import { TaskStatusValidation } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService:TasksService){
  }

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto){
    return this.taskService.getTasks(filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id',ParseIntPipe) id:number): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() creatTaskDto: CreatTaskDto): Promise<Task>{
    return this.taskService.createTask(creatTaskDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id',ParseIntPipe) id:number): Promise<void> {
    return this.taskService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id:number,
    @Body('status',TaskStatusValidation) status: TaskStatus
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id,status);
  }



}
