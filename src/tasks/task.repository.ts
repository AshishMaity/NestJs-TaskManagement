import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { GetTaskFilterDto } from "./dto/get-tasks-filter.dto";
import { CreateTaskDto } from "./dto/task.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{

  async getTasks(filterDto:GetTaskFilterDto,user:User): Promise<Task[]>{

    const {search, status} = filterDto;
    const query = this.createQueryBuilder('task');
    query.where('task.userId = :userId', {userId : user.id});
    if(status){
      await query.andWhere('task.status = :status', {status: status})
    }
    if(search){
      await query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`});
    }
    return await query.getMany();

  }

  async createTask(createTaskDto:CreateTaskDto,user:User): Promise<Task>{
    const {title,description} = createTaskDto;
    const task  = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();
    delete task.user;
    return task;
  }
}