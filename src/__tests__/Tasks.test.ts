import json from "../../public/onelvl.json";
import { DefaultLevel } from "../engine/Levels/Defaultlevel";
import { RootLevel } from "../engine/Levels/RootLevel";
jest.setTimeout(100000);
const lvl = new DefaultLevel(json as any, {});
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
        tasks: [
          {
            name: "root-level1-task1",
            actionsFlow: "async",
            delay: 250,
            actions: [
              {
                name: "root-level1-task1-action1",
                type: "log",
                message: "root-level1-task1-action1",
              },
              {
                name: "root-level1-task1-action2",
                type: "log",
                message: "root-level1-task1-action2",
              },
            ],
          },
        ],
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
      onTaskStarted(task) {
        expect(task.status).toBe("running");
      },
      onTaskStartDelay(task) {
        time = performance.now();
        expect(task.status).toBe("running");
      },
      onTaskWaitingForInput(task) {
        expect(task.status).toBe("waiting");
      },
      onTaskFinishDelay(task) {
        const elapsed = performance.now() - time;
        expect(elapsed).toBeGreaterThan(250);
        expect(elapsed).toBeLessThan(250 + 50);
      },
      onTaskFinished(task) {
        expect(task.status).toBe("finished");
      },
    },
  });

  const p = rootLevel.start();

  await p;
});
test.concurrent("task pauses for external input to resolve", async () => {
  const test_level = {
    levelsFlow: "sync",
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
        tasks: [
          {
            name: "root-level1-task1",
            actionsFlow: "async",
            delay: 0,
            externalInput: true,
            actions: [
              {
                name: "root-level1-task1-action1",
                type: "log",
                message: "root-level1-task1-action1",
              },
              {
                name: "root-level1-task1-action2",
                type: "log",
                message: "root-level1-task1-action2",
              },
            ],
          },
        ],
      },
    ],
    tasks: [],
  };
  let time = performance.now();
  // jest mock function
  const onTaskStarted = jest.fn((task) => {
    time = performance.now();
    expect(task.status).toBe("running");
  });
  const onTaskWaitingForInput = jest.fn((task, finish) => {
    setTimeout(() => {
      finish("test");
    }, 2500);
  });
  const onTaskFinished = jest.fn((task) => {
    expect(task.status).toBe("finished");
    expect(performance.now() - time).toBeGreaterThan(2500);
  });
  const rootLevel = new RootLevel(test_level as any, {
    events: {
      onTaskStarted,
      onTaskWaitingForInput,
      onTaskFinished,
    },
  });

  const p = rootLevel.start();

  await p;

  expect(onTaskStarted).toBeCalledTimes(1);
  expect(onTaskWaitingForInput).toBeCalledTimes(1);
  expect(onTaskFinished).toBeCalledTimes(1);
});
