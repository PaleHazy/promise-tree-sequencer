// src/utils.ts
function isRoot(level) {
  return level.root === level;
}
function logLvl(node) {
  const lt = `%c[Level]: ${node.name}
`;
  const lc = `color: ${node.colors.color}; background: ${node.colors.bg};`;
  return { lt, lc };
}
function logTask(node) {
  const tt = `%c[Task]: ${node.name}
`;
  const tc = `color: ${node.colors.color}; background: ${node.colors.bg};`;
  return { tc, tt };
}
function logAction(node) {
  const at = `%c[Action]: ${node.name}
`;
  const ac = `color: ${node.colors.color}; background: ${node.colors.bg};`;
  return { ac, at };
}
function log(node, ...args) {
  if (node instanceof BaseLevel) {
    const { lc, lt } = logLvl(node);
    console.log(
      ...[lt, lc],
      ...args
    );
  } else if (node instanceof BaseTask) {
    const { lc, lt } = logLvl(node.level);
    const { tc, tt } = logTask(node);
    console.log(lt + tt, lc, tc, ...args);
  } else if (node instanceof BaseAction) {
    const { lc, lt } = logLvl(node.task.level);
    const { tc, tt } = logTask(node.task);
    const { ac, at } = logAction(node);
    console.log(lt + tt + at, lc, tc, ac, ...args);
  }
}
function randomContrastColors() {
  let r = Math.floor(Math.random() * 256 - 1);
  let g = Math.floor(Math.random() * 256 - 1);
  let b = Math.floor(Math.random() * 256 - 1);
  let brightness = (r * 299 + g * 587 + b * 114) / 1e3;
  let lightText = (255 * 299 + 255 * 587 + 255 * 114) / 1e3;
  let darkText = (0 * 299 + 0 * 587 + 0 * 114) / 1e3;
  let bg = "rgb(" + r + "," + g + "," + b + ")";
  let color = "";
  if (Math.abs(brightness - lightText) > Math.abs(brightness - darkText)) {
    color = "rgb(255, 255, 255)";
  } else {
    color = "rgb(0, 0, 0)";
  }
  return { bg, color };
}
function touchAllLevels(level, cb) {
  cb(level);
  for (const child of level.levelBuffer) {
    touchAllLevels(child, cb);
  }
}

// node_modules/.pnpm/nanoid@4.0.0/node_modules/nanoid/index.browser.js
var nanoid = (size = 21) => crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
  byte &= 63;
  if (byte < 36) {
    id += byte.toString(36);
  } else if (byte < 62) {
    id += (byte - 26).toString(36).toUpperCase();
  } else if (byte > 62) {
    id += "-";
  } else {
    id += "_";
  }
  return id;
}, "");

// src/engine/Actions/BaseAction.ts
var BaseAction = class {
  name;
  task;
  status = "ready";
  colors = randomContrastColors();
  id = "a_" + nanoid();
  constructor(actionDto, task) {
    this.name = actionDto.name;
    this.task = task;
  }
  updateStatus(status) {
    this.status = status;
  }
  succesfullyFinished() {
    this.updateStatus("finished");
  }
};

// src/engine/Actions/DefaultAction.ts
var DefaultAction = class extends BaseAction {
  constructor(actionDto, task) {
    super(actionDto, task);
  }
  async run() {
    this.succesfullyFinished();
    return this;
  }
};

// src/engine/Tasks/BaseTask.ts
var BaseTask = class {
  level;
  name;
  actions = [];
  status = "ready";
  actionsFlow;
  actionsPromisesBuffer = [];
  taskPromise;
  error;
  delay;
  colors = randomContrastColors();
  id = "t_" + nanoid();
  taskResolve = () => {
  };
  taskReject = () => {
  };
  constructor(taskDto, level) {
    this.name = taskDto.name;
    this.level = level;
    this.delay = taskDto.delay;
    this.actionsFlow = taskDto.actionsFlow;
    this.loadActions(taskDto);
  }
  loadActions(taskDto) {
    for (const action of taskDto.actions) {
      this.actions.push(new DefaultAction(action, this));
    }
  }
  _runActionsAsync() {
    this.status = "running";
    this.taskPromise = new Promise((resolve, reject) => {
      this.actionsPromisesBuffer = this.actions.map((action) => action.run());
      Promise.all(this.actionsPromisesBuffer).then((actionsResults) => {
        for (const actionResult of actionsResults) {
          if (actionResult.status === "failed") {
            this.taskReject(this);
            return;
          }
        }
        this.status = "finished";
        resolve(this);
      }).catch((error) => {
        this.error = error;
        this.status = "failed";
        reject(this);
      });
    });
    return this.taskPromise;
  }
  async _runActionsSync() {
    for (const action of this.actions) {
      await action.run();
    }
    return this;
  }
  async _runActions() {
    if (this.actionsFlow === "async") {
      return await this._runActionsAsync();
    } else if (this.actionsFlow === "sync") {
      return await this._runActionsSync();
    }
    return this;
  }
  _delay() {
    return new Promise((resolve) => setTimeout(resolve, this.delay));
  }
  setStarting() {
    var _a, _b, _c;
    this.status = "running";
    log(this, "starting");
    (_c = (_a = this.level.root) == null ? void 0 : (_b = _a.events).onTaskStarted) == null ? void 0 : _c.call(_b, this);
  }
  setFinished() {
    var _a, _b, _c;
    this.status = "finished";
    log(this, "finished");
    (_c = (_a = this.level.root) == null ? void 0 : (_b = _a.events).onTaskFinished) == null ? void 0 : _c.call(_b, this);
  }
  async start() {
    this.setStarting();
    return this.flush();
  }
  async flush() {
    var _a, _b, _c, _d, _e, _f;
    if (this.delay) {
      let t = performance.now();
      log(this, "delaying");
      (_c = (_a = this.level.root) == null ? void 0 : (_b = _a.events).onTaskStartDelay) == null ? void 0 : _c.call(_b, this);
      await this._delay();
      log(this, "delay done", performance.now() - t, this.delay);
      (_f = (_d = this.level.root) == null ? void 0 : (_e = _d.events).onTaskFinishDelay) == null ? void 0 : _f.call(_e, this);
    }
    try {
      await this.taskImplemetation();
    } catch (e) {
      this.error = e;
      this.status = "failed";
      return this;
    }
    let result = await this._runActions();
    this.setFinished();
    return result;
  }
};

// src/engine/Tasks/DefaultTask.ts
var DefaultTask = class extends BaseTask {
  constructor(taskDto, level) {
    super(taskDto, level);
  }
  async taskImplemetation() {
  }
};

// src/engine/Levels/BaseLevel.ts
var BaseLevel = class {
  root;
  parent;
  status = "ready";
  levelsFlow;
  tasksFlow;
  levelBuffer = [];
  taskBuffer = [];
  name;
  duration = 0;
  _startTime = 0;
  delay;
  colors = randomContrastColors();
  id = "l_" + nanoid();
  constructor(dto, options) {
    this.parent = options == null ? void 0 : options.parent;
    this.levelsFlow = dto.levelsFlow;
    this.buildTree(dto);
    this.name = dto.name;
    this.delay = dto.delay;
    this.loadTasks(dto);
  }
  setstarting() {
    var _a, _b, _c;
    this.status = "running";
    log(this, "starting");
    this._startTime = performance.now();
    (_c = (_a = this.root) == null ? void 0 : (_b = _a.events).onLevelStarted) == null ? void 0 : _c.call(_b, this);
  }
  setFinished() {
    var _a, _b, _c;
    this.status = "finished";
    this.duration = performance.now() - this._startTime;
    (_c = (_a = this.root) == null ? void 0 : (_b = _a.events).onLevelFinished) == null ? void 0 : _c.call(_b, this);
  }
  loadTasks(dto) {
    this.tasksFlow = dto.tasksFlow;
    for (const taskDto of dto.tasks) {
      this.taskBuffer.push(new DefaultTask(taskDto, this));
    }
  }
  buildTree(dto) {
    for (const levelDto of dto.levels) {
      this.levelBuffer.push(new DefaultLevel(levelDto, { root: this.root, parent: this }));
    }
  }
  start() {
    this.setstarting();
    return this.flush();
  }
  async flush() {
    var _a, _b, _c, _d, _e, _f;
    if (this.delay) {
      let t = performance.now();
      log(this, "delaying for", this.delay);
      (_c = (_a = this.root) == null ? void 0 : (_b = _a.events).onLevelStartDelay) == null ? void 0 : _c.call(_b, this);
      await new Promise((resolve) => setTimeout(resolve, this.delay));
      log(this, "delayed for", performance.now() - t, this.delay);
      (_f = (_d = this.root) == null ? void 0 : (_e = _d.events).onLevelFinishDelay) == null ? void 0 : _f.call(_e, this);
    }
    log(this, "flushing");
    if (this.levelsFlow === "async") {
      return this.flushLevelsAsync();
    } else if (this.levelsFlow === "sync") {
      return this.flushLevelsSync();
    }
    return this;
  }
  async flushLevelsAsync() {
    if (this.levelBuffer.length) {
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
  async flushLevelsSync() {
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
  async flushTasks() {
    if (this.tasksFlow === "async") {
      return this.flushTasksAsync();
    } else if (this.tasksFlow === "sync") {
      return this.flushTasksSync();
    }
    return;
  }
  async flushTasksAsync() {
    if (this.status === "cancelled") {
      return;
    }
    if (this.taskBuffer.length === 0) {
      return;
    }
    const promises = this.taskBuffer.map((task) => {
      if (task.status === "cancelled") {
        return Promise.resolve();
      }
      return task.start();
    });
    return await Promise.all(promises);
  }
  async flushTasksSync() {
    if (this.status === "cancelled") {
      return;
    }
    if (this.taskBuffer.length === 0) {
      return;
    }
    const results = [];
    for (const task of this.taskBuffer) {
      if (task.status === "cancelled") {
        return Promise.resolve();
      }
      const actions = await task.start();
    }
  }
};

// src/engine/Levels/Defaultlevel.ts
var DefaultLevel = class extends BaseLevel {
  constructor(dto, options) {
    super(dto, options);
  }
};

// src/engine/Levels/RootLevel.ts
var RootLevel = class extends DefaultLevel {
  events = {
    onTaskWaitingForInput: () => {
    },
    onLevelStarted: () => {
    },
    onLevelStartDelay: () => {
    },
    onLevelFinishDelay: () => {
    },
    onLevelFinished: () => {
    },
    onTaskStarted: () => {
    },
    onTaskStartDelay: () => {
    },
    onTaskFinishDelay: () => {
    },
    onTaskFinished: () => {
    }
  };
  constructor(dto, options) {
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
  updateEvents(events) {
    this.events = {
      ...this.events,
      ...events
    };
  }
};

// src/creator/Creator.ts
var LevelDtoEditor = class {
  levels = [];
  tasks = [];
  levelsFlow = "async";
  tasksFlow = "async";
  name = "empty_level";
  delay = 0;
  constructor() {
  }
  appendLevel(level) {
    return this.levels.push(level);
  }
  appendTask(task) {
    return this.tasks.push(task);
  }
  print() {
    const output = {
      name: this.name,
      levelsFlow: this.levelsFlow,
      tasksFlow: this.tasksFlow,
      delay: this.delay,
      levels: this.levels.map((level) => level.print()),
      tasks: this.tasks.map((task) => task.print())
    };
    return output;
  }
};
var TaskDtoEditor = class {
  name = "empty_task";
  actions = [];
  delay = 0;
  constructor() {
  }
  appendAction(action) {
    return this.actions.push(action);
  }
  print() {
    const output = {
      name: this.name,
      actionsFlow: "async",
      type: "default",
      delay: this.delay,
      actions: this.actions.map((action) => action.print())
    };
    return output;
  }
};
var DEFAULT_LEVEL = {
  levels: [],
  tasks: [],
  levelsFlow: "async",
  tasksFlow: "async",
  name: "empty_level",
  delay: 0
};
var Creator = class {
  structure = DEFAULT_LEVEL;
  constructor() {
    console.log("creator");
  }
  createLevel() {
    return new LevelDtoEditor();
  }
  createLevelEditorFromDto(dto) {
    return new LevelDtoEditor();
  }
  createTask() {
    return new TaskDtoEditor();
  }
};
function convertTimelineToInteractivity(timeline) {
  const creator = new Creator();
  const root = creator.createLevel();
  root.name = "root";
  const timelineRootLevel = creator.createLevel();
  root.appendLevel(timelineRootLevel);
  timelineRootLevel.name = "timeline_root";
  timelineRootLevel.levelsFlow = "async";
  timelineRootLevel.tasksFlow = "async";
  timeline.animatedObjects.forEach((animatedObject) => {
    const animatedObjectLevel = creator.createLevel();
    animatedObjectLevel.name = "animated_object";
    animatedObjectLevel.levelsFlow = "sync";
    animatedObjectLevel.tasksFlow = "async";
    const id = animatedObject.id;
    const start = animatedObject.start;
    const end = animatedObject.end;
    if (typeof start !== "number") {
      throw new Error("start is not a number");
    }
    if (start > 0) {
      const startTask = creator.createTask();
      startTask.name = "start_delay";
      startTask.delay = start * 1e3;
      animatedObjectLevel.appendTask(startTask);
    }
    if (end === null) {
    } else {
      if (typeof end !== "number") {
        throw new Error("end is not a number");
      }
      if (end > 0) {
        const endTask = creator.createTask();
        endTask.name = "end_delay";
        if (typeof start !== "number") {
          endTask.delay = end * 1e3;
        } else {
          endTask.delay = (end - start) * 1e3;
        }
        animatedObjectLevel.appendTask(endTask);
      }
    }
    timelineRootLevel.appendLevel(animatedObjectLevel);
  });
  return root.print();
}
export {
  BaseLevel,
  DefaultLevel,
  RootLevel,
  convertTimelineToInteractivity,
  nanoid
};
//# sourceMappingURL=index.esm.js.map