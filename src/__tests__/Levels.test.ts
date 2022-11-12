import json from "../../public/onelvl.json";
import { DefaultLevel } from "../engine/Levels/Defaultlevel";
import { RootLevel } from "../engine/Levels/RootLevel";
import { touchAllLevels } from "../utils";

jest.setTimeout(100000);

let rootLevel = new DefaultLevel(json as any, {});

beforeAll(async () => {
  // run a global engine setup
  await rootLevel.start();
});

test("the level has a finished status when done", async () => {
  expect(rootLevel.status).toBe("finished");

  touchAllLevels(rootLevel, (level) => {
    expect(level.status).toBe("finished");

    level.taskBuffer.forEach((task) => {
      expect(task.status).toBe("finished");
    });
  });
});

test("status is running right the start", async () => {
  const rootLevel = new DefaultLevel(json as any, {});
  const p = rootLevel.start();
  expect(rootLevel.status).toBe("running");
  await p;
});

const level = {
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

test("level delays appropriate time", async () => {
  let time = performance.now();
  const rootLevel = new RootLevel(level as any, {
    events: {
      onLevelStartDelay(level) {
        time = performance.now();
        expect(level.status).toBe("running");
      },
      onLevelFinishDelay(level) {
        expect(performance.now() - time).toBeGreaterThan(5000);
        expect(level.status).toBe("running");
      }
    },
  });
  const p = rootLevel.start();
  await p;
});
