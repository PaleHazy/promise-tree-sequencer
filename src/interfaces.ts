import { DefaultAction } from "./engine/Actions/DefaultAction";
import { BaseLevel } from "./engine/Levels/BaseLevel";
import { DefaultLevel } from "./engine/Levels/Defaultlevel";
import { RootLevel } from "./engine/Levels/RootLevel";
import { BaseTask } from "./engine/Tasks/BaseTask";
import { DefaultTask } from "./engine/Tasks/DefaultTask";
import { ExternalInputTask } from "./engine/Tasks/ExternalInputTask";


export type FlowModes = "async" | "sync";
/**
 * Level status
 * ready - level is ready to be started, the initial state
 * running - level is running
 * paused - level is paused
 * finished - level finished succesfully
 * 
 */
export type LevelStatus = "ready" | "running" | "paused" | "finished" | "cancelled";
export type TaskStatus = "ready" | "running" | "paused" | "finished" | "cancelled"  | "failed";
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
  actions: ActionDto[];
  delay?: number;
}
export interface ActionDto {
  name: string;
}

// --------------------------------------

export type Levels = BaseLevel | RootLevel | DefaultLevel
export type Tasks = DefaultTask | BaseTask |  ExternalInputTask
export type Actions = DefaultAction