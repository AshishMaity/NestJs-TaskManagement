import { PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";
export declare class TaskStatusValidation implements PipeTransform {
    readonly taskStatuses: TaskStatus[];
    transform(value: any): any;
}
