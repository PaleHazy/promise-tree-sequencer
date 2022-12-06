import { DefaultAction } from "../../engine/Actions/DefaultAction";
import { BaseLevel } from "../../engine/Levels/BaseLevel";
import { Actions, FlowModes, TaskDto, Tasks, TaskStatus } from "../../interfaces";
import { nanoid } from "nanoid";
import { log, randomContrastColors } from "../../utils";

interface TaskDelay {
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
// previously action
export abstract class BaseTask {
  level: BaseLevel;
  name: string;
  actions: Actions[] = [];
  status: TaskStatus = "ready";
  actionsFlow: FlowModes;
  actionsPromisesBuffer: Promise<Actions>[] = [];
  taskPromise?: Promise<Tasks>;
  error?: Error | any;
  externalInput?: boolean;
  delay: TaskDelay = {
    value: 0,
    totalDuration: 0,
  };
  colors = randomContrastColors()
  readonly id = "t_" + nanoid()
  
  taskResolve: (value: Tasks) => void = () => {};
  taskReject: (reason?: any) => void = () => {};
  constructor(taskDto: TaskDto, level: BaseLevel) {
    this.name = taskDto.name;
    this.level = level;
    this.delay.value = taskDto.delay ?? 0;
    this.actionsFlow = taskDto.actionsFlow;
    this.externalInput = taskDto.externalInput;
    this.loadActions(taskDto);
  }


  pause() {
    if(this.status === "running") {
      this.status = "paused"
      this.level.root?.events.onTaskPaused?.(this);
      clearTimeout(this.delay.timeoutId);
    } else {

    }
  }

  resume() {
    if(this.status === "paused") {
      this.status = "running"
      this.level.root?.events.onTaskResumed?.(this);
      this.delay.timeoutId = setTimeout(() => {
        
        this.delay.delayPromiseResolve?.(this);
      
      }, this.delay.value)
    } else {
  
    }
  }
  
  loadActions(taskDto: TaskDto) {
    for (const action of taskDto.actions) {
      this.actions.push(new DefaultAction(action, this));
    }
  }

  _runActionsAsync(): Promise<Tasks> {
    this.taskPromise = new Promise((resolve, reject) => {
      //run custom logic here
      this.actionsPromisesBuffer = this.actions.map((action) => action.run());
      Promise.all(this.actionsPromisesBuffer)
        .then((actionsResults) => {
          // validate actions results
          for (const actionResult of actionsResults) {
            // this lines quits the task if any action fails
            if (actionResult.status === "failed") {
              this.taskReject(this);
              return;
            }
          }
          this.status = "finished";
          resolve(this);
        })
        .catch((error) => {
          this.error = error;
          this.status = "failed";
          reject(this);
        });
    });
    return this.taskPromise;
  }

  async _runActionsSync(): Promise<Tasks> {
    for (const action of this.actions) {
      await action.run();
    }
    return this;
  }

  async _runActions(): Promise<Tasks> {
    if (this.actionsFlow === "async") {
      return await this._runActionsAsync();
    } else if (this.actionsFlow === "sync") {
      return await this._runActionsSync();
    }
    return this;
  }

  private async _delay(delay = this.delay.value) {
    this.status = "delaying";
    log(this, "delaying for", delay);

    this.level.root?.events.onTaskStartDelay?.(this);
    this.delay.start = performance.now();
    this.delay.delayPromise = new Promise((resolve) => {
      this.status = "delaying";
      this.delay.delayPromiseResolve = resolve;
      this.delay.timeoutId = setTimeout(() => {
        this.delay.delayPromiseResolve?.(this);
      }, delay)
    });
    await this.delay.delayPromise;
    this.delay.finish = performance.now();
    this.delay.duration = this.delay.finish - this.delay.start;
    this.delay.totalDuration += this.delay.duration;
    this.delay.sway = this.delay.duration - delay;
    this.delay.delayPromise = undefined; // clean
    this.delay.delayPromiseResolve = undefined; // clean
    this.delay.timeoutId = undefined; // clean
    this.status = "running";
    log(this, "delay done", this.delay.totalDuration, this.delay);
    this.level.root?.events.onTaskFinishDelay?.(this);
  }

  private setStarting() {
    this.status = "running";
    log(this, "starting");
    this.level.root?.events.onTaskStarted?.(this);
  }

  private setFinished() {
    this.status = "finished";
    log(this, "finished");
    this.level.root?.events.onTaskFinished?.(this);
  }
  
  public async start(): Promise<Tasks> {
    this.setStarting();
    return this.flush();
    
  }

  protected async flush(): Promise<Tasks> {
    if (this.delay.value) {
      await this._delay();
    }

    if (this.externalInput) {
      log(this, "waiting for external input");
      let waitPromise = new Promise((resolve) => {
         this.status = "waiting";
        this.level.root?.events?.onTaskWaitingForInput?.(this, resolve);    
      });
      await waitPromise;
    }

    try {
      await this.taskImplemetation();
    } catch(e) {
      this.error = e;
      this.status = "failed";
      return this;
    }
    let result = await this._runActions();
    this.setFinished()
    return result

  }
  abstract taskImplemetation(): Promise<void>;
}
