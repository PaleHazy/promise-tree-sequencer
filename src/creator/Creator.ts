import { ActionDto, FlowModes, LevelDto, TaskDto } from "../interfaces";
export class LevelDtoEditor {
  levels: LevelDtoEditor[] = [];
  tasks: TaskDtoEditor[] = [];
  levelsFlow: FlowModes = "async";
  tasksFlow: FlowModes = "async";
  name = "empty_level";
  delay?: number = 0

  constructor() {}

  appendLevel(level: LevelDtoEditor) {
    return this.levels.push(level);
  }

  appendTask(task: TaskDtoEditor) {
    return this.tasks.push(task);
  }
  print(): LevelDto {
    const output = {
      name: this.name,
      levelsFlow: this.levelsFlow,
      tasksFlow: this.tasksFlow,
      delay: this.delay,
      levels: this.levels.map((level) => level.print()),
      tasks: this.tasks.map((task) => task.print()),
    };
    return output;
  }
}
export class ActionDtoEditor {
  name = "empty_action";
  constructor() {}
  print(): ActionDto {
    const output = {
      name: this.name,
    };
    return output;
  }
}
export class TaskDtoEditor {
  name = "empty_task";
  actions: ActionDtoEditor[] = [];
  delay: number = 0
  constructor() {}

  appendAction(action: ActionDtoEditor) {
    return this.actions.push(action);
  }
  print(): TaskDto {
    const output: TaskDto = {
      name: this.name,
      actionsFlow: "async",
      type: "default",
      delay: this.delay,
      actions: this.actions.map((action) => action.print()),
    };
    return output;
  }
}
const DEFAULT_LEVEL: LevelDto = {
  levels: [],
  tasks: [],
  levelsFlow: "async",
  tasksFlow: "async",
  name: "empty_level",
  delay: 0,
};
export class Creator {
  structure: LevelDto = DEFAULT_LEVEL;
  constructor() {
    console.log("creator");
  }
  createLevel(): LevelDtoEditor {
    return new LevelDtoEditor();
  }
  createLevelEditorFromDto(dto: LevelDto): LevelDtoEditor {
    return new LevelDtoEditor();
  }

  createTask() {
    return new TaskDtoEditor();
  }

}

export function convertTimelineToInteractivity(timeline: any) {
  const creator = new Creator();
  const root = creator.createLevel();
  root.name = "root";
  const timelineRootLevel = creator.createLevel();
  root.appendLevel(timelineRootLevel);
  timelineRootLevel.name = "timeline_root";
  timelineRootLevel.levelsFlow = "async";
  timelineRootLevel.tasksFlow = "async";

  timeline.animatedObjects.forEach((animatedObject: any) => {
    const animatedObjectLevel = creator.createLevel();
    animatedObjectLevel.name = "animated_object";
    animatedObjectLevel.levelsFlow = "sync";
    animatedObjectLevel.tasksFlow = "async";

    const id = animatedObject.id;
    const start = animatedObject.start;
    const end = animatedObject.end;

    
    if(typeof start !== "number") {
      throw new Error("start is not a number");
    }
    
    if(start > 0) {
      const startTask = creator.createTask();
      startTask.name = "start_delay";
      startTask.delay = start * 1000;
      animatedObjectLevel.appendTask(startTask);
    }

    if(end === null) {
      // do nothing
    } else {
      if(typeof end !== "number") {
        throw new Error("end is not a number");
      }
      if(end > 0) {
        const endTask = creator.createTask();
        endTask.name = "end_delay";
        if(typeof start !== "number") {
          endTask.delay = end * 1000;
        } else {
          endTask.delay = (end - start) * 1000;
        }

        animatedObjectLevel.appendTask(endTask);
      }
    }
    

    timelineRootLevel.appendLevel(animatedObjectLevel);
  });
  return root.print();
}
