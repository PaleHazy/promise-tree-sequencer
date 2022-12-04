export const one_level = {
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

export const three_levels_250_delay = {
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