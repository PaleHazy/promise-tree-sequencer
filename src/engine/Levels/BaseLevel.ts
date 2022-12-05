import { DefaultTask } from "../Tasks/DefaultTask";
import { FlowModes, LevelDto, Levels, LevelStatus, Tasks } from "../../interfaces";
import { isRoot, log, randomContrastColors, touchAllLevels } from "../../utils";
import { RootLevel } from "./RootLevel";
import { nanoid } from "nanoid";
import { DefaultLevel } from "./Defaultlevel";
import { LEVEL_PAUSED_STATE, LEVEL_RUNNING_STATE } from "../../utils/constants";

// import { DefaultLevel } from "./Defaultlevel";
export interface Options {
  root?: RootLevel;
  transformer?: any;
  parent?: Levels;
}

interface LevelDelay {
  value: number;
  start?: number;
  finish?: number;
  sway?: number;
  duration?: number;
  totalDuration: number;
  timeoutId?: number | NodeJS.Timeout;
  delayPromise?: Promise<void>;
  delayPromiseResolve?: (val: any) => void;
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
  delay: LevelDelay = {
    value: 0,
    totalDuration: 0,
  }
  readonly colors = randomContrastColors();
  readonly id = "l_" + nanoid();

  constructor(dto: LevelDto, options?: Options) {
    this.parent = options?.parent;
    this.levelsFlow = dto.levelsFlow;
    this.buildTree(dto);
    this.name = dto.name;
    this.delay.value = dto.delay ?? 0;
    this.loadTasks(dto);
  }

  setstarting() {
    this.status = LEVEL_RUNNING_STATE;
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

  private async _delay(delay: number = this.delay.value) {
    this.status = "delaying";
    log(this, "delaying for", delay);
    this.delay.start = performance.now();
    this.root?.events.onLevelStartDelay?.(this);

    this.delay.delayPromise = new Promise((resolve) => {
      this.delay.delayPromiseResolve = resolve;
      this.delay.timeoutId = setTimeout(resolve, delay);
    });
    await this.delay.delayPromise;
    this.delay.finish = performance.now();
    this.delay.duration = this.delay.finish - this.delay.start;
    this.delay.totalDuration += this.delay.duration;
    this.delay.sway = this.delay.duration - delay;
    this.delay.delayPromise = undefined; // clean
    this.delay.delayPromiseResolve = undefined; // clean
    this.delay.timeoutId = undefined; // clean
    this.status = LEVEL_RUNNING_STATE;
    log(this, "delayed for", this.delay.totalDuration, delay);
    this.root?.events.onLevelFinishDelay?.(this);
  }

  
  public start(): Promise<Levels> {
    this.setstarting();
    return this.flush();
  }


  protected async flush() {
    if (this.delay.value) {
      await this._delay();
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
    if (this.status === LEVEL_PAUSED_STATE) {
      this.resume();
    } else if (this.status === LEVEL_RUNNING_STATE) {
      this.pause();
    }
  }

  /**
   * pausing a level will switch it's status to paused
   * and will pause only the tasks inside it
   */
  pause() {
    if (this.status === LEVEL_PAUSED_STATE) {
      console.warn("lvl is already paused");
      return;
    }

    this.status = LEVEL_PAUSED_STATE;


    if (this.delay.value) {
      log(this, "clearing timeout");
      clearTimeout(this.delay.timeoutId);
      // store the remaining time
      this.delay.value = calculateNewDelay(this.delay);
      this.delay.duration = performance.now() - this.delay.start!
      this.delay.totalDuration += this.delay.duration
    }
    
    this.taskBuffer.forEach((task) => {
      task.pause();
    });

    
    this.root?.events.onLevelPaused?.(this);
  }

  resume() {
    if(this.status !== LEVEL_PAUSED_STATE){
      console.warn("lvl is not paused");
      return;
    }

    this.status = LEVEL_RUNNING_STATE;

    if (this.delay.value) {
      // reset start time 
      this.delay.start = performance.now();
      this.delay.timeoutId = setTimeout(() => {
        this.delay.delayPromiseResolve?.('');
      }, this.delay.value);
    }

    this.taskBuffer.forEach((task) => {
      task.resume();
    });

      this.root?.events.onLevelResumed?.(this);
  }
}


function calculateNewDelay(delay: LevelDelay) {
  const newDelay = delay.value - (performance.now() - delay.start!);
  return newDelay;
}