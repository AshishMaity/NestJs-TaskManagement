import { EntityRepository, Repository } from "typeorm";
import { GetTaskFilterDto } from "./dto/get-tasks-filter.dto";
import { CreatTaskDto } from "./dto/task.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{

  async getTasks(filterDto:GetTaskFilterDto): Promise<Task[]>{

    const {search, status} = filterDto;
    const query = this.createQueryBuilder('task');

    if(status){
      await query.andWhere('task.status = :status', {status: status})
    }

    if(search){
      await query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`});
    }
    
    return await query.getMany();

  }

  async createTask(createTaskDto:CreatTaskDto): Promise<Task>{
    const {title,description} = createTaskDto;
    const task  = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.save();

    return task;
  }
}