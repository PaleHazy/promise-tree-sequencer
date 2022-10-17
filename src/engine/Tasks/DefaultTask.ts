
import { BaseLevel } from "../../engine/Levels/BaseLevel";
import { TaskDto } from "../../interfaces";
import { log } from "../../utils";
import { BaseTask } from "./BaseTask";

export class DefaultTask extends BaseTask {
  constructor(taskDto: TaskDto, level: BaseLevel) {
    super(taskDto, level);
  }



  async taskImplemetation() {
    // log(this, "DefaultTask run", this.name);

    // return this;
  }
}