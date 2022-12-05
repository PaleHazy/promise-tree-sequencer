import { nanoid } from "nanoid";
import { LevelDto } from "../interfaces";
let counter = 0;
const level= {
  levelsFlow: "async",
  tasksFlow: "sync",
  delay: 0,
  name: "root-level1",
  levels: [],
  tasks: [],
}

const level_with_delay = (delay=250): LevelDto => ({
  levelsFlow: "async",
  tasksFlow: "sync",
  delay,
  name: nanoid(),
  levels: [],
  tasks: [],
})

export const async_one_level_with_delay = {
  levelsFlow: "async",
  tasksFlow: "async",
  name: "root",
  delay: 0,
  levels: [
    level_with_delay(5000)
  ],
  tasks: [],
};
export const async_one_level = {
  levelsFlow: "async",
  tasksFlow: "async",
  name: "root",
  delay: 0,
  levels: [
    level
  ],
  tasks: [],
};

export const async_three_levels_250_delay = {
  levelsFlow: "async",
  tasksFlow: "async",
  name: "root",
  delay: 0,
  levels: [
    level_with_delay(),
    level_with_delay(),
    level_with_delay(),
  ],
  tasks: [],
};
export const async_three_levels = {
  levelsFlow: "async",
  tasksFlow: "async",
  name: "root",
  delay: 0,
  levels: [
    level,
    level,
    level
  ],
  tasks: [],
};

export const sync_three_levels_250_delay = {
  levelsFlow: "sync",
  tasksFlow: "async",
  name: "root",
  delay: 0,
  levels: [
    level_with_delay(),
    level_with_delay(),
    level_with_delay(),
  ],
  tasks: [],
};
export const sync_three_levels = {
  levelsFlow: "sync",
  tasksFlow: "async",
  name: "root",
  delay: 0,
  levels: [
    level_with_delay(),
    level_with_delay(),
    level_with_delay(),
  ],
  tasks: [],
};

export const many_concurrent_different_delays = {
  levelsFlow: "async",
  tasksFlow: "async",
  name: "root",
  delay: 0,
  levels: [
    level_with_delay(250),
    level_with_delay(500),
    level_with_delay(1000),
    level_with_delay(2000),
  ],
  tasks: [],
};