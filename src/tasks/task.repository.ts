import { EntityRepository, Repository } from "typeorm";
import { CreatTaskDto } from "./dto/task.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{

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