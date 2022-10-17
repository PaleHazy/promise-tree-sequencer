import { BaseTask } from "../../engine/Tasks/BaseTask";
import { ActionDto, ActionStatus, Tasks } from "../../interfaces";
import { randomContrastColors } from "../../utils";
import { nanoid } from "nanoid";

export abstract class BaseAction {
  name: string;
  task: Tasks;
  status: ActionStatus = "ready";
  readonly colors = randomContrastColors();
  readonly id = "a_" + nanoid()
  constructor(actionDto: ActionDto, task: Tasks) {
    this.name = actionDto.name;
    this.task = task;
  }
  
  abstract run(): Promise<this>;

  protected updateStatus(status: ActionStatus) {
    this.status = status;
  }

  protected succesfullyFinished() {
    this.updateStatus("finished"); 
  }

  
}