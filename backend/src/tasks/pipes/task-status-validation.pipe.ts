import { BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

export class TaskStatusValidation implements PipeTransform{

  readonly taskStatuses = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN
  ];

  transform(value:any){
    const status = value.toUpperCase();
    console.log(value);
    const isStatusValid = this.taskStatuses.indexOf(status) > -1;
    if(!isStatusValid){
      throw new BadRequestException(`Status ${status} does not exist`);
    }

    return status;
  }
}