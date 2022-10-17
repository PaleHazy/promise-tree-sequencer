import { BaseLevel } from "../../engine/Levels/BaseLevel";
import { TaskDto } from "../../interfaces";
import { BaseTask } from "./BaseTask";

export class ExternalInputTask extends BaseTask {
 externalWaitPromise: Promise<any> | undefined = undefined;
  constructor(taskDto: TaskDto, level: BaseLevel) {
    super(taskDto, level);

    
  }

  taskImplemetation() {
    this.externalWaitPromise = new Promise((resolve, reject) => {
      // call the listener here
      
      if(this.level.root?.events.onTaskWaitingForInput) {
        
        this.level.root.events.onTaskWaitingForInput(this, resolve);
      } else {
        reject("No listener for external input");
        throw new Error("onTaskWaitingForInput event listener is not set");
      }
    })
    return this.externalWaitPromise;
  }
}


/**
 *  
 *  how to pass in the listener so it is available to all the tasks
 * 
 *  1- drill it down at build time
 *    - this is not a good idea because it will be hard to maintain
 *    - it will be hard to test
 *    - it will be hard to add the event listener if it is not available, dynamic adding of levels
 * 
 *  
 * 
 * 
 * 
 * {
 *   "type": "externalInput",
 *   "name": "externalInput-1",
 *   "actionsFlow": "async",
 * 
 *   "":""
 * 
 * 
 * }
 * 
 */