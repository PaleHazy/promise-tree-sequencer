import json from "../../public/onelvl.json";
import { DefaultLevel } from "../engine/Levels/Defaultlevel";
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