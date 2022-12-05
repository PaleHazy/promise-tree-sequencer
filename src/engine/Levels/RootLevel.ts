import { LevelDto, Levels, Tasks } from "../../interfaces";
import { isRoot, log, touchAllLevels } from "../../utils";
import { Options } from "./BaseLevel";
import { DefaultLevel } from "./Defaultlevel";

interface RootOptions {
  events: {
    onTaskWaitingForInput?: (task: Tasks, complete: (val: unknown) => void) => void;
    onLevelStarted?: (level: Levels) => void;
    onLevelStartDelay?: (level: Levels) => void;
    onLevelPaused?: (level: Levels) => void;
    onLevelResumed?: (level: Levels) => void;
    onLevelFinishDelay?: (level: Levels) => void;
    onLevelFinished?: (level: Levels) => void;
    onTaskStarted?: (task: Tasks) => void;
    onTaskStartDelay?: (task: Tasks) => void;
    onTaskPaused?: (task: Tasks) => void;
    onTaskResumed?: (task: Tasks) => void;
    onTaskFinishDelay?: (task: Tasks) => void;
    onTaskFinished?: (task: Tasks) => void;
  };
}

export class RootLevel extends DefaultLevel {
  events: RootOptions["events"] = {
    onTaskWaitingForInput: () => {},
    onLevelStarted: () => {},
    onLevelStartDelay: () => {},
    onLevelPaused: () => {},
    onLevelResumed: () => {},
    onLevelFinishDelay: () => {},
    onLevelFinished: () => {},
    onTaskStarted: () => {},
    onTaskStartDelay: () => {},
    onTaskFinishDelay: () => {},
    onTaskFinished: () => {},
  };
  constructor(dto: LevelDto, options: Options & RootOptions) {
    super(dto, options);
    touchAllLevels(this, (level) => {
      level.root = this;
    });
    if (options.events.onTaskWaitingForInput) {
      this.events.onTaskWaitingForInput = options.events.onTaskWaitingForInput;
    }
    if (options.events.onLevelStarted) {
      this.events.onLevelStarted = options.events.onLevelStarted;
    }
    if (options.events.onLevelStartDelay) {
      this.events.onLevelStartDelay = options.events.onLevelStartDelay;
    }
    if (options.events.onLevelFinishDelay) {
      this.events.onLevelFinishDelay = options.events.onLevelFinishDelay;
    }

    if (options.events.onLevelFinished) {
      this.events.onLevelFinished = options.events.onLevelFinished;
    }
    if (options.events.onTaskStarted) {
      this.events.onTaskStarted = options.events.onTaskStarted;
    }
    if (options.events.onTaskStartDelay) {
      this.events.onTaskStartDelay = options.events.onTaskStartDelay;
    }
    if (options.events.onTaskFinishDelay) {
      this.events.onTaskFinishDelay = options.events.onTaskFinishDelay;
    }
    if (options.events.onTaskFinished) {
      this.events.onTaskFinished = options.events.onTaskFinished;
    }
  }

  updateEvents(events: RootOptions) {
    this.events = {
      ...this.events,
      ...events,
    };
  }

  pauseAll() {
    touchAllLevels(this, (level) => {
      level.pause();
    });
  }

  resumeAll() {
    touchAllLevels(this, (level) => {
      level.resume();
    });
  }
}
