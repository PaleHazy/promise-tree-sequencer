export { nanoid } from 'nanoid';

declare abstract class BaseTask {
    level: BaseLevel;
    name: string;
    actions: Actions[];
    status: TaskStatus;
    actionsFlow: FlowModes;
    actionsPromisesBuffer: Promise<Actions>[];
    taskPromise?: Promise<Tasks>;
    error?: Error | any;
    readonly delay?: number;
    colors: {
        bg: string;
        color: string;
    };
    readonly id: string;
    taskResolve: (value: Tasks) => void;
    taskReject: (reason?: any) => void;
    constructor(taskDto: TaskDto, level: BaseLevel);
    loadActions(taskDto: TaskDto): void;
    _runActionsAsync(): Promise<Tasks>;
    _runActionsSync(): Promise<Tasks>;
    _runActions(): Promise<Tasks>;
    private _delay;
    protected setStarting(): void;
    protected setFinished(): void;
    start(): Promise<Tasks>;
    protected flush(): Promise<Tasks>;
    abstract taskImplemetation(): Promise<void>;
}

declare abstract class BaseAction {
    name: string;
    task: Tasks;
    status: ActionStatus;
    readonly colors: {
        bg: string;
        color: string;
    };
    readonly id: string;
    constructor(actionDto: ActionDto, task: Tasks);
    abstract run(): Promise<this>;
    protected updateStatus(status: ActionStatus): void;
    protected succesfullyFinished(): void;
}

declare class DefaultAction extends BaseAction {
    constructor(actionDto: ActionDto, task: BaseTask);
    run(): Promise<this>;
}

declare class DefaultLevel extends BaseLevel {
    constructor(dto: LevelDto, options: Options);
}

interface RootOptions {
    events: {
        onTaskWaitingForInput?: (task: Tasks) => void;
        onLevelStarted?: (level: Levels) => void;
        onLevelStartDelay?: (level: Levels) => void;
        onLevelFinishDelay?: (level: Levels) => void;
        onLevelFinished?: (level: Levels) => void;
        onTaskStarted?: (task: Tasks) => void;
        onTaskStartDelay?: (task: Tasks) => void;
        onTaskFinishDelay?: (task: Tasks) => void;
        onTaskFinished?: (task: Tasks) => void;
    };
}
declare class RootLevel extends DefaultLevel {
    events: RootOptions['events'];
    constructor(dto: LevelDto, options: Options & RootOptions);
    updateEvents(events: RootOptions): void;
}

declare class DefaultTask extends BaseTask {
    constructor(taskDto: TaskDto, level: BaseLevel);
    taskImplemetation(): Promise<void>;
}

declare class ExternalInputTask extends BaseTask {
    externalWaitPromise: Promise<any> | undefined;
    constructor(taskDto: TaskDto, level: BaseLevel);
    taskImplemetation(): Promise<any>;
}

declare type FlowModes = "async" | "sync";
/**
 * Level status
 * ready - level is ready to be started, the initial state
 * running - level is running
 * paused - level is paused
 * finished - level finished succesfully
 *
 */
declare type LevelStatus = "ready" | "running" | "paused" | "finished" | "cancelled";
declare type TaskStatus = "ready" | "running" | "paused" | "finished" | "cancelled" | "failed";
declare type ActionStatus = "ready" | "running" | "paused" | "finished" | "cancelled" | "failed";
interface LevelDto {
    levelsFlow: FlowModes;
    tasksFlow: FlowModes;
    levels: LevelDto[];
    tasks: TaskDto[];
    name: string;
    delay?: number;
}
interface TaskDto {
    name: string;
    type: string;
    actionsFlow: FlowModes;
    actions: ActionDto[];
    delay?: number;
}
interface ActionDto {
    name: string;
}
declare type Levels = BaseLevel | RootLevel | DefaultLevel;
declare type Tasks = DefaultTask | BaseTask | ExternalInputTask;
declare type Actions = DefaultAction;

interface Options {
    root?: RootLevel;
    transformer?: any;
    parent?: Levels;
}
declare abstract class BaseLevel {
    root?: RootLevel;
    parent?: Levels;
    status: LevelStatus;
    levelsFlow: FlowModes;
    tasksFlow: FlowModes;
    levelBuffer: Levels[];
    taskBuffer: Tasks[];
    name: string;
    duration: number;
    private _startTime;
    readonly delay?: number;
    readonly colors: {
        bg: string;
        color: string;
    };
    readonly id: string;
    constructor(dto: LevelDto, options?: Options);
    setstarting(): void;
    setFinished(): void;
    private loadTasks;
    private buildTree;
    start(): Promise<Levels>;
    protected flush(): Promise<this>;
    private flushLevelsAsync;
    private flushLevelsSync;
    protected flushTasks(): Promise<void | (void | Tasks)[]>;
    private flushTasksAsync;
    private flushTasksSync;
}

declare function convertTimelineToInteractivity(timeline: any): LevelDto;

export { BaseLevel, DefaultLevel, RootLevel, convertTimelineToInteractivity };
