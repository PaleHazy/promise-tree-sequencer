import { BaseLevel } from "../../engine/Levels/BaseLevel";
import { DefaultLevel } from "../../engine/Levels/Defaultlevel";
import { RootLevel } from "../../engine/Levels/RootLevel";
import { touchAllLevels } from "../../utils";
import { one_level, three_levels_250_delay } from "../test_levels";

jest.setTimeout(100000);

test.concurrent("the level has a finished status when done", async () => {

  const rootLevel = new DefaultLevel(one_level as any, {});
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

  const rootLevel = new DefaultLevel(one_level as any, {});
  const p = rootLevel.start();
  expect(rootLevel.status).toBe("running");

  await p;
});

test.concurrent("level delays appropriate time", async () => {

  let time = performance.now();
  const rootLevel = new RootLevel(one_level as any, {
    events: {
      onLevelStartDelay(level) {
        if (level.name === one_level.levels[0].name) {
          time = performance.now();
          expect(level.status).toBe("running");
        }
      },
      onLevelFinishDelay(level) {
        if (level.name === one_level.levels[0].name) {
          expect(performance.now() - time).toBeGreaterThanOrEqual(one_level.levels[0].delay);
          expect(level.status).toBe("running");
        }
      },
    },
  });
  const p = rootLevel.start();
  await p;
});

test.concurrent("async level flow starts all nested levels immediately", async () => {
  
  let time = performance.now();
  const rootLevel = new RootLevel(three_levels_250_delay as any, {
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

  let time = performance.now();
  const rootLevel = new RootLevel(three_levels_250_delay as any, {
    events: {
      onLevelStarted(level) {
        switch (level.name) {
          case three_levels_250_delay.levels[0].name:
            expect(rootLevel.levelBuffer[0].status).toBe("running");
            expect(rootLevel.levelBuffer[1].status).toBe("ready");
            expect(rootLevel.levelBuffer[2].status).toBe("ready");
            break;
          case three_levels_250_delay.levels[1].name:
            expect(rootLevel.levelBuffer[0].status).toBe("finished");
            expect(rootLevel.levelBuffer[1].status).toBe("running");
            expect(rootLevel.levelBuffer[2].status).toBe("ready");
            break;
          case three_levels_250_delay.levels[2].name:
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
  
  let time = performance.now();
  const rootLevel = new RootLevel(three_levels_250_delay as any, {
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