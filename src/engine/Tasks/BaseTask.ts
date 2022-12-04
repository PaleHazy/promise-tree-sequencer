import { DefaultAction } from "../../engine/Actions/DefaultAction";
import { BaseLevel } from "../../engine/Levels/BaseLevel";
import { Actions, FlowModes, TaskDto, Tasks, TaskStatus } from "../../interfaces";
import { nanoid } from "nanoid";
import { log, randomContrastColors } from "../../utils";

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
  readonly delay?: number;
  colors = randomContrastColors()
  readonly id = "t_" + nanoid()
  private delayTimeout: number | NodeJS.Timeout = 0;
  private delayResolve: (value: Tasks) => void = () => {};
  taskResolve: (value: Tasks) => void = () => {};
  taskReject: (reason?: any) => void = () => {};
  constructor(taskDto: TaskDto, level: BaseLevel) {
    this.name = taskDto.name;
    this.level = level;
    this.delay = taskDto.delay;
    this.actionsFlow = taskDto.actionsFlow;
    this.externalInput = taskDto.externalInput;
    this.loadActions(taskDto);
  }


  pause() {
    if(this.status === "running") {
      this.status = "paused"
      this.level.root?.events.onTaskPaused?.(this);
      clearTimeout(this.delayTimeout);
    } else {

    }
  }

  resume() {
    if(this.status === "paused") {
      this.status = "running"
      this.level.root?.events.onTaskResumed?.(this);
      const remainingDelay = 200
      this.delayTimeout = setTimeout(() => {
        

      
      }, )
      this.delayResolve(this);
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

  private _delay() {
    return new Promise((resolve) => {
      this.status = "delaying";
      this.delayResolve = resolve;
      this.delayTimeout = setTimeout(() => {
        this.delayResolve(this);
        this.status = "running";
      }, this.delay)
    });
  }

  protected setStarting() {
    this.status = "running";
    log(this, "starting");
    this.level.root?.events.onTaskStarted?.(this);
  }

  protected setFinished() {
    this.status = "finished";
    log(this, "finished");
    this.level.root?.events.onTaskFinished?.(this);
  }
  
  public async start(): Promise<Tasks> {
    this.setStarting();
    return this.flush();
    
  }

  protected async flush(): Promise<Tasks> {
    if (this.delay) {
      let t = performance.now();
      log(this, "delaying");
      this.level.root?.events.onTaskStartDelay?.(this);
      await this._delay();
      log(this, "delay done", performance.now() - t, this.delay);
      this.level.root?.events.onTaskFinishDelay?.(this);
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
