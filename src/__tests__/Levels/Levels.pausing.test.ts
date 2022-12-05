import { LEVEL_DELAY_STATE, LEVEL_PAUSED_STATE, LEVEL_RUNNING_STATE } from "../../utils/constants";
import { async_one_level_with_delay } from "../../utils/test_levels";
import { DefaultLevel } from "../../engine/Levels/Defaultlevel";
import { RootLevel } from "../../engine/Levels/RootLevel";

const hack = DefaultLevel;

jest.setTimeout(100000);






test.concurrent("pausing tree while running", async () => {
  console.log("test started");
  const onLevelPaused = jest.fn((level) => {
    expect(level.status).toBe(LEVEL_PAUSED_STATE);
  });

  const onLevelResumed = jest.fn((level) => {
    expect(level.status).toBe(LEVEL_RUNNING_STATE);
  });

  const onLevelFinishDelay = jest.fn((level) => {
    expect(level.delay.totalDuration).toBeGreaterThanOrEqual(
      async_one_level_with_delay.levels[0].delay
    );
    expect(level.status).toBe(LEVEL_RUNNING_STATE);
  });
  const rootLevel = new RootLevel(async_one_level_with_delay as any, {
    events: {
      onLevelPaused,
      onLevelResumed,
      onLevelFinishDelay,
    },
  });

  const p = rootLevel.start();

  // the test here pauses, resumes, pauses, resumes 
  setTimeout(() => {
    rootLevel.pauseAll();
    setTimeout(() => {
      rootLevel.resumeAll();
      setTimeout(() => {
        rootLevel.pauseAll();
        setTimeout(() => {
          rootLevel.resumeAll();
        }, 500);
      }, 250);
    }, 500);
  }, 1000);

  await p;

  expect(onLevelPaused).toHaveBeenCalledTimes(4);
  expect(onLevelResumed).toHaveBeenCalledTimes(4);
  expect(onLevelFinishDelay).toHaveBeenCalledTimes(1);
});
