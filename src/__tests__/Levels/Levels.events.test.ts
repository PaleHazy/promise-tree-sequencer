import { DefaultLevel } from "../../engine/Levels/Defaultlevel";
import { RootLevel } from "../../engine/Levels/RootLevel";
import { LEVEL_DELAY_STATE, LEVEL_RUNNING_STATE } from "../../utils/constants";
import { async_one_level, async_one_level_with_delay } from "../../utils/test_levels";

const hack = DefaultLevel;

jest.setTimeout(100000);




test.concurrent("", async () => {
  const rootLevel = new RootLevel(async_one_level as any, {
    events: {
      onLevelStarted(level) {
          expect(level.status).toBe(LEVEL_RUNNING_STATE);
      }
    },
  });

  const p = rootLevel.start();
  await p;
});

test.concurrent("Delay events", async () => {
  const data = async_one_level_with_delay;
  const rootLevel = new RootLevel(data as any, {
    events: {
      onLevelStartDelay(level) {
        if (level.name === data.levels[0].name) {
          expect(level.status).toBe(LEVEL_DELAY_STATE);
        }
      },
      onLevelFinishDelay(level) {
        if (level.name === data.levels[0].name) {
          expect(level.status).toBe(LEVEL_RUNNING_STATE);
        }
      }
    },
  });

  const p = rootLevel.start();
  await p;
});