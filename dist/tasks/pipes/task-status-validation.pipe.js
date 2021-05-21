"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatusValidation = void 0;
const common_1 = require("@nestjs/common");
const task_status_enum_1 = require("../task-status.enum");
class TaskStatusValidation {
    constructor() {
        this.taskStatuses = [
            task_status_enum_1.TaskStatus.DONE,
            task_status_enum_1.TaskStatus.IN_PROGRESS,
            task_status_enum_1.TaskStatus.OPEN
        ];
    }
    transform(value) {
        const status = value.toUpperCase();
        console.log(value);
        const isStatusValid = this.taskStatuses.indexOf(status) > -1;
        if (!isStatusValid) {
            throw new common_1.BadRequestException(`Status ${status} does not exist`);
        }
        return status;
    }
}
exports.TaskStatusValidation = TaskStatusValidation;
//# sourceMappingURL=task-status-validation.pipe.js.map