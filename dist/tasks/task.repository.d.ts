import { Repository } from "typeorm";
import { CreatTaskDto } from "./dto/task.dto";
import { Task } from "./task.entity";
export declare class TaskRepository extends Repository<Task> {
    createTask(createTaskDto: CreatTaskDto): Promise<Task>;
}
