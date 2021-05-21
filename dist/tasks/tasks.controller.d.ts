import { CreatTaskDto } from './dto/task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
export declare class TasksController {
    private taskService;
    constructor(taskService: TasksService);
    getTaskById(id: number): Promise<Task>;
    createTask(creatTaskDto: CreatTaskDto): Promise<Task>;
    deleteTask(id: number): Promise<void>;
    updateTaskStatus(id: number, status: TaskStatus): Promise<Task>;
}
