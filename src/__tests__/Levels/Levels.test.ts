import { nextTick } from "process";
import { BaseLevel } from "../../engine/Levels/BaseLevel";
import { DefaultLevel } from "../../engine/Levels/Defaultlevel";
import { RootLevel } from "../../engine/Levels/RootLevel";
import { touchAllLevels } from "../../utils";
import { LEVEL_DELAY_STATE, LEVEL_RUNNING_STATE } from "../../utils/constants";
import {
  async_one_level,
  async_one_level_with_delay,
  async_three_levels,
  async_three_levels_250_delay,
  sync_three_levels,
  sync_three_levels_250_delay,
} from "../../utils/test_levels";

jest.setTimeout(100000);





test.concurrent("the level has a finished status when done", async () => {
  const rootLevel = new DefaultLevel(async_one_level_with_delay as any, {});
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
  const rootLevel = new DefaultLevel(async_one_level as any, {});
  const p = rootLevel.start();
  expect(rootLevel.status).toBe(LEVEL_RUNNING_STATE);

  await p;
});

test.concurrent("level delays appropriate time", async () => {
  let time = performance.now();
  const rootLevel = new RootLevel(async_one_level_with_delay as any, {
    events: {
      onLevelStartDelay(level) {
        if (level.name === async_one_level_with_delay.levels[0].name) {
          time = performance.now();
          expect(level.status).toBe(LEVEL_DELAY_STATE);
        }
      },
      onLevelFinishDelay(level) {
        if (level.name === async_one_level_with_delay.levels[0].name) {
          expect(performance.now() - time).toBeGreaterThanOrEqual(
            async_one_level_with_delay.levels[0].delay!
          );
          expect(level.status).toBe(LEVEL_RUNNING_STATE);
        }
      },
    },
  });
  const p = rootLevel.start();
  await p;
});

test.concurrent("async level flow starts all nested levels immediately", async () => {
  let time = performance.now();
  const rootLevel = new RootLevel(async_three_levels as any, {
    events: {
      onLevelStarted(level) {
        expect(level.status).toBe(LEVEL_RUNNING_STATE);
      },
    },
  });

  const p = rootLevel.start();
  expect(rootLevel.status).toBe(LEVEL_RUNNING_STATE);

  expect(rootLevel.levelBuffer[0].status).toBe(LEVEL_RUNNING_STATE);
  expect(rootLevel.levelBuffer[1].status).toBe(LEVEL_RUNNING_STATE);
  expect(rootLevel.levelBuffer[2].status).toBe(LEVEL_RUNNING_STATE);

  await p;
});


test.concurrent("sync level flow starts nested levels one after the other", async () => {
  let time = performance.now();
  const rootLevel = new RootLevel(sync_three_levels as any, {
    events: {
      onLevelStarted(level) {
        switch (level.name) {
          case sync_three_levels_250_delay.levels[0].name:
            expect(rootLevel.levelBuffer[0].status).toBe(LEVEL_RUNNING_STATE);
            expect(rootLevel.levelBuffer[1].status).toBe("ready");
            expect(rootLevel.levelBuffer[2].status).toBe("ready");
            break;
          case sync_three_levels_250_delay.levels[1].name:
            expect(rootLevel.levelBuffer[0].status).toBe("finished");
            expect(rootLevel.levelBuffer[1].status).toBe(LEVEL_RUNNING_STATE);
            expect(rootLevel.levelBuffer[2].status).toBe("ready");
            break;
          case sync_three_levels_250_delay.levels[2].name:
            expect(rootLevel.levelBuffer[0].status).toBe("finished");
            expect(rootLevel.levelBuffer[1].status).toBe("finished");
            expect(rootLevel.levelBuffer[2].status).toBe(LEVEL_RUNNING_STATE);
        }
      },
      onLevelFinishDelay(level) {},
    },
  });

  const p = rootLevel.start();

  await p;
});
