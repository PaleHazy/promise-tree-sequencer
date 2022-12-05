export const async_one_level_with_delay = {
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
export const async_one_level = {
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

export const async_three_levels_250_delay = {
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
export const async_three_levels = {
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
    {
      levelsFlow: "async",
      tasksFlow: "sync",
      delay: 0,
      name: "root-level2",
      levels: [],
      tasks: [],
    },
    {
      levelsFlow: "async",
      tasksFlow: "sync",
      delay: 0,
      name: "root-level3",
      levels: [],
      tasks: [],
    },
  ],
  tasks: [],
};

export const sync_three_levels_250_delay = {
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
      tasks: [],
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
export const sync_three_levels = {
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
      tasks: [],
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

export const many_concurrent_different_delays = {
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
      delay: 500,
      name: "root-level2",
      levels: [],
      tasks: [],
    },
    {
      levelsFlow: "async",
      tasksFlow: "sync",
      delay: 750,
      name: "root-level3",
      levels: [],
      tasks: [],
    },
     {
      levelsFlow: "async",
      tasksFlow: "sync",
      delay: 1000,
      name: "root-level4",
      levels: [], 
      tasks: [],
     },
     
     {
      levelsFlow: "async",
      tasksFlow: "sync",
      delay: 1500,
      name: "root-level5",
      levels: [], 
      tasks: [],
     },
     {
      levelsFlow: "async",
      tasksFlow: "sync",
      delay: 2000,
      name: "root-level6",
      levels: [], 
      tasks: [],
     },

  ],
  tasks: [],
};