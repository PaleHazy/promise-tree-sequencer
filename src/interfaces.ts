import { DefaultAction } from "./engine/Actions/DefaultAction";
import { BaseLevel } from "./engine/Levels/BaseLevel";
import { DefaultLevel } from "./engine/Levels/Defaultlevel";
import { RootLevel } from "./engine/Levels/RootLevel";
import { BaseTask } from "./engine/Tasks/BaseTask";
import { DefaultTask } from "./engine/Tasks/DefaultTask";
import { LEVEL_PAUSED_STATE, LEVEL_RUNNING_STATE } from "./utils/constants";


export type FlowModes = "async" | "sync";
/**
 * Level status
 * ready - level is ready to be started, the initial state
 * running - level is running
 * paused - level is paused
 * finished - level finished succesfully
 * 
 */
export type LevelStatus = "ready" | typeof LEVEL_RUNNING_STATE | "delaying" | typeof LEVEL_PAUSED_STATE | "finished" | "cancelled" | "failed";
export type TaskStatus = "ready" | "running" | "waiting" | "delaying" | "paused" | "finished" | "cancelled"  | "failed";
export type ActionStatus = "ready" | "running" | "paused" | "finished" | "cancelled" | "failed";
export interface LevelDto {
  levelsFlow: FlowModes;
  tasksFlow: FlowModes;
  levels: LevelDto[];
  tasks: TaskDto[];
  name: string;
  delay?: number;
}
export interface TaskDto {
  name: string;
  type: string;
  actionsFlow: FlowModes;
  externalInput?: boolean;
  actions: ActionDto[];
  delay?: number;
}
export interface ActionDto {
  name: string;
}

// --------------------------------------

export type Levels = BaseLevel | RootLevel | DefaultLevel
export type Tasks = DefaultTask | BaseTask 
export type Actions = DefaultAction