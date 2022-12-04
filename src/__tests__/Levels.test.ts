import json from "../../public/onelvl.json";
import { DefaultLevel } from "../engine/Levels/Defaultlevel";
import { RootLevel } from "../engine/Levels/RootLevel";
import { touchAllLevels } from "../utils";

jest.setTimeout(100000);



test("the level has a finished status when done", async () => {
  const dataLevel = {
    levelsFlow: "async",
    tasksFlow: "async",
    name: "root",
    delay: 0,
    levels: [
      {
        levelsFlow: "async",
        tasksFlow: "sync",
        delay: 0,
        name: "root-level1",
        levels: [],
        tasks: [],
      },
    ],
    tasks: [],
  };

  const level = new DefaultLevel(dataLevel as any, {});
  await level.start()
  expect(level.status).toBe("finished");

  touchAllLevels(level, (level) => {
    expect(level.status).toBe("finished");

    level.taskBuffer.forEach((task) => {
      expect(task.status).toBe("finished");
    });
  });
});

test("status is running right the start", async () => {
  const dataLevel = {
    levelsFlow: "async",
    tasksFlow: "async",
    name: "root",
    delay: 0,
    levels: [
      {
        levelsFlow: "async",
        tasksFlow: "sync",
        delay: 0,
        name: "root-level1",
        levels: [],
        tasks: [],
      },
    ],
    tasks: [],
  };
  const rootLevel = new DefaultLevel(dataLevel as any, {});
  const p = rootLevel.start();
  expect(rootLevel.status).toBe("running");

  await p;
});

test("level delays appropriate time", async () => {
  const dataLevel = {
    levelsFlow: "async",
    tasksFlow: "async",
    name: "root",
    delay: 0,
    levels: [
      {
        levelsFlow: "async", 
        tasksFlow: "sync",
        delay: 1500,
        name: "root-level1",
        levels: [],
        tasks: [],
      },
    ],
    tasks: [],
  };

  let time = performance.now();
  const rootLevel = new RootLevel(dataLevel as any, {
    events: {
      onLevelStartDelay(level) {
        time = performance.now();
        expect(level.status).toBe("running");
      },
      onLevelFinishDelay(level) {
        expect(performance.now() - time).toBeGreaterThan(dataLevel.levels[0].delay);
        expect(level.status).toBe("running");
      },
    },
  });
  const p = rootLevel.start();
  await p;
});
