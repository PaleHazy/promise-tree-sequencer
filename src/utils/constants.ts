/**
 * a level is running as soon as the promise for that level is started
 */
export const LEVEL_RUNNING_STATE = "running";

/**
 * 
 * a level can only be paused if it has a delay
 * since delays are generated using setTimeout 
 * the state of being paused means that the setTimeout has been cleared
 * and a value is stored representing the remaining time
 * 
 */
export const LEVEL_PAUSED_STATE = "paused";
