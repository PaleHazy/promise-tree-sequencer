import { DefaultTask } from "../Tasks/DefaultTask";
import { FlowModes, LevelDto, Levels, LevelStatus, Tasks } from "../../interfaces";
import { isRoot, log, randomContrastColors, touchAllLevels } from "../../utils";
import { RootLevel } from "./RootLevel";
import { nanoid } from "nanoid";
import { DefaultLevel } from "./Defaultlevel";

// import { DefaultLevel } from "./Defaultlevel";
export interface Options {
  root?: RootLevel;
  transformer?: any;
  parent?: Levels;
}

export abstract class BaseLevel {
  root?: RootLevel; // get set at the end
  parent?: Levels;
  status: LevelStatus = "ready";
  levelsFlow!: FlowModes;
  tasksFlow!: FlowModes;
  levelBuffer: Levels[] = [];
  taskBuffer: Tasks[] = [];
  name: string;
  duration: number = 0;
  private _startTime: number = 0;
  readonly delay?: number;
  readonly colors = randomContrastColors();
  readonly id = "l_" + nanoid();

  constructor(dto: LevelDto, options?: Options) {
    this.parent = options?.parent;
    this.levelsFlow = dto.levelsFlow;
    this.buildTree(dto);
    this.name = dto.name;
    this.delay = dto.delay;
    this.loadTasks(dto);
  }

  setstarting() {
    this.status = "running";

    log(this, "starting");
    this._startTime = performance.now();
    this.root?.events.onLevelStarted?.(this);
  }

  setFinished() {
    this.status = "finished";
    this.duration = performance.now() - this._startTime;
    this.root?.events.onLevelFinished?.(this);
  }

  private loadTasks(dto: LevelDto) {
    this.tasksFlow = dto.tasksFlow;
    for (const taskDto of dto.tasks) {
      this.taskBuffer.push(new DefaultTask(taskDto, this));
    }
  }
  private buildTree(dto: LevelDto) {
    for (const levelDto of dto.levels) {
      this.levelBuffer.push(new DefaultLevel(levelDto, { root: this.root, parent: this }));
    }
  }

  public start(): Promise<Levels> {
    this.setstarting();

    return this.flush();
  }

  protected async flush() {
    if (this.delay) {
      let t = performance.now();
      log(this, "delaying for", this.delay);
      this.root?.events.onLevelStartDelay?.(this);
      await new Promise((resolve) => setTimeout(resolve, this.delay));
      log(this, "delayed for", performance.now() - t, this.delay);
      this.root?.events.onLevelFinishDelay?.(this);
    }
    log(this, "flushing");

    if (this.levelsFlow === "async") {
      return this.flushLevelsAsync();
    } else if (this.levelsFlow === "sync") {
      return this.flushLevelsSync();
    }
    return this;
  }

  private async flushLevelsAsync() {
    if (this.levelBuffer.length) {
      // this.status = "running";
      let levelPromisesBuffer = this.levelBuffer.map((level) => {
        return level.start();
      });

      if (this.status === "cancelled") {
        return this;
      }

      const levelResults = await Promise.all(levelPromisesBuffer);
    }

    const taskResults = await this.flushTasks();
    if (isRoot(this)) {
      log(this, "Done with the root level");
    }
    this.setFinished();
    return this;
  }
  private async flushLevelsSync() {
    if (this.levelBuffer.length) {
      for (const level of this.levelBuffer) {
        await level.start();
      }

      if (this.status === "cancelled") {
        return this;
      }

      return this;
    }
    const taskResults = await this.flushTasks();
    if (isRoot(this)) {
      log(this, "Done with the root level");
    }

    this.setFinished();
    return this;
  }
  protected async flushTasks() {
    if (this.tasksFlow === "async") {
      return this.flushTasksAsync();
    } else if (this.tasksFlow === "sync") {
      return this.flushTasksSync();
    }
    return;
  }
  private async flushTasksAsync() {
    // checking if the level is cancelled
    if (this.status === "cancelled") {
      return;
    }
    if (this.taskBuffer.length === 0) {
      return;
    }
    const promises = this.taskBuffer.map((task) => {
      if (task.status === "cancelled") {
        // careful here
        return Promise.resolve();
      }
      return task.start();
    });
    return await Promise.all(promises);
  }
  private async flushTasksSync() {
    // checking if the level is cancelled
    if (this.status === "cancelled") {
      return;
    }
    if (this.taskBuffer.length === 0) {
      return;
    }

    const results = [];
    for (const task of this.taskBuffer) {
      if (task.status === "cancelled") {
        // careful here
        return Promise.resolve();
      }

      const actions = await task.start();
    }
  }

  togglePause() {
    if (this.status === "paused") {
      touchAllLevels(this, (level) => {

        level.status = "running";
      });
    } else if (this.status === "running") {
      this.status = "paused";
    }
  }
}
