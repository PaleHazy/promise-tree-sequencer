import { BaseLevel } from "../engine/Levels/BaseLevel";
import { DefaultLevel } from "../engine/Levels/Defaultlevel";
import { RootLevel } from "../engine/Levels/RootLevel";
import { touchAllLevels } from "../utils";

jest.setTimeout(100000);

test.concurrent("the level has a finished status when done", async () => {
  const test_level = {
    levelsFlow: "async",
    tasksFlow: "async",
    name: "root",
    delay: 0,
    levels: [
      {
        levelsFlow: "async",
        tasksFlow: "sync",
        delay: 5000,
        name: "root-level1",
        levels: [],
        tasks: [],
      },
    ],
    tasks: [],
  };
  const rootLevel = new DefaultLevel(test_level as any, {});
  await rootLevel.start();
  expect(rootLevel.status).toBe("finished");

  touchAllLevels(rootLevel, (level) => {
    expect(level.status).toBe("finished");

    level.taskBuffer.forEach((task) => {
      expect(task.status).toBe("finished");
    });
  });
});

test.concurrent("status is running right the start", async () => {
  const test_level = {
    levelsFlow: "async",
    tasksFlow: "async",
    name: "root",
    delay: 0,
    levels: [
      {
        levelsFlow: "async",
        tasksFlow: "sync",
        delay: 5000,
        name: "root-level1",
        levels: [],
        tasks: [],
      },
    ],
    tasks: [],
  };
  const rootLevel = new DefaultLevel(test_level as any, {});
  const p = rootLevel.start();
  expect(rootLevel.status).toBe("running");
  await p;
});

test.concurrent("level delays appropriate time", async () => {
  const test_level = {
    levelsFlow: "async",
    tasksFlow: "async",
    name: "root",
    delay: 0,
    levels: [
      {
        levelsFlow: "async",
        tasksFlow: "sync",
        delay: 5000,
        name: "root-level1",
        levels: [],
        tasks: [],
      },
    ],
    tasks: [],
  };
  let time = performance.now();
  const rootLevel = new RootLevel(test_level as any, {
    events: {
      onLevelStartDelay(level) {
        if (level.name === test_level.levels[0].name) {
          time = performance.now();
          expect(level.status).toBe("running");
        }
      },
      onLevelFinishDelay(level) {
        if (level.name === test_level.levels[0].name) {
          expect(performance.now() - time).toBeGreaterThanOrEqual(test_level.levels[0].delay);
          expect(level.status).toBe("running");
        }
      },
    },
  });
  const p = rootLevel.start();
  await p;
});

test.concurrent("async level flow starts all nested levels immediately", async () => {
  const test_level = {
    levelsFlow: "async",
    tasksFlow: "async",
    name: "root",
    delay: 0,
    levels: [
      {
        levelsFlow: "async",
        tasksFlow: "sync",
        delay: 250,
        name: "root-level1",
        levels: [],
        tasks: [],
      },
      {
        levelsFlow: "async",
        tasksFlow: "sync",
        delay: 250,
        name: "root-level1",
        levels: [],
        tasks: [],
      },
      {
        levelsFlow: "async",
        tasksFlow: "sync",
        delay: 250,
        name: "root-level1",
        levels: [],
        tasks: [],
      },
    ],
    tasks: [],
  };
  let time = performance.now();
  const rootLevel = new RootLevel(test_level as any, {
    events: {
      onLevelStartDelay(level) {
  
      },
      onLevelFinishDelay(level) {
        
      },
    },
  });

  const p = rootLevel.start();
  
  expect(rootLevel.levelBuffer[0].status).toBe("running");
  expect(rootLevel.levelBuffer[1].status).toBe("running");
  expect(rootLevel.levelBuffer[2].status).toBe("running");
  
  await p;
});
test.concurrent("sync level flow starts nested levels one after the other", async () => {
  const test_level = {
    levelsFlow: "sync",
    tasksFlow: "async",
    name: "root",
    delay: 0,
    levels: [
      {
        levelsFlow: "async",
        tasksFlow: "sync",
        delay: 250,
        name: "root-level1",
        levels: [],
        tasks: [],
      },
      {
        levelsFlow: "async",
        tasksFlow: "sync",
        delay: 250,
        name: "root-level2",
        levels: [],
        tasks: [],
      },
      {
        levelsFlow: "async",
        tasksFlow: "sync",
        delay: 250,
        name: "root-level3",
        levels: [],
        tasks: [],
      },
    ],
    tasks: [],
  };
  let time = performance.now();
  const rootLevel = new RootLevel(test_level as any, {
    events: {
      onLevelStarted(level) {
        switch (level.name) {
          case test_level.levels[0].name:
            expect(rootLevel.levelBuffer[0].status).toBe("running");
            expect(rootLevel.levelBuffer[1].status).toBe("ready");
            expect(rootLevel.levelBuffer[2].status).toBe("ready");
            break;
          case test_level.levels[1].name:
            expect(rootLevel.levelBuffer[0].status).toBe("finished");
            expect(rootLevel.levelBuffer[1].status).toBe("running");
            expect(rootLevel.levelBuffer[2].status).toBe("ready");
            break;
          case test_level.levels[2].name:
            expect(rootLevel.levelBuffer[0].status).toBe("finished");
            expect(rootLevel.levelBuffer[1].status).toBe("finished");
            expect(rootLevel.levelBuffer[2].status).toBe("running");
        }
      },
      onLevelFinishDelay(level) {
        
      },
    },
  });

  const p = rootLevel.start();

  
  await p;
});

test.concurrent("pausing tree while running", async () => {
  const test_level = {
    levelsFlow: "sync",
    tasksFlow: "async",
    name: "root",
    delay: 0,
    levels: [
      {
        levelsFlow: "async",
        tasksFlow: "sync",
        delay: 250,
        name: "root-level1",
        levels: [],
        tasks: [],
      },
      {
        levelsFlow: "async",
        tasksFlow: "sync",
        delay: 250,
        name: "root-level2",
        levels: [],
        tasks: [],
      },
      {
        levelsFlow: "async",
        tasksFlow: "sync",
        delay: 250,
        name: "root-level3",
        levels: [],
        tasks: [],
      },
    ],
    tasks: [],
  };
  let time = performance.now();
  const rootLevel = new RootLevel(test_level as any, {
    events: {
      onLevelStarted(level) {
        
      },
      onLevelFinishDelay(level) {
        
      },
    },
  });

  const p = rootLevel.start();

  
  await p;
});