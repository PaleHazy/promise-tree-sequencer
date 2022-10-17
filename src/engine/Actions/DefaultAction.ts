import { BaseTask } from "../../engine/Tasks/BaseTask";
import { ActionDto } from "../../interfaces";
import { log } from "../../utils";
import { BaseAction } from "./BaseAction";

export class DefaultAction extends BaseAction {
  constructor(actionDto: ActionDto, task: BaseTask) {
    super(actionDto, task);
  }

  async run() {
    // log(this,"DefaultAction run", this.name);
    this.succesfullyFinished();
    return this;
  }
}