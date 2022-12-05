// import { RootLevel } from "../../engine/Levels/RootLevel";
// import { many_concurrent_different_delays, three_levels_250_delay } from "../test_levels";

// test.concurrent("pausing tree while running", async () => {
  
//   let time = performance.now();
//   const rootLevel = new RootLevel(many_concurrent_different_delays as any, {
//     events: {
//       onLevelStarted(level) {
        
//       },
//       onLevelFinishDelay(level) {
        
//       },
//     },
//   });

//   const p = rootLevel.start();

  
//   await p;
// });
test("test", () => {
  expect(1).toBe(1);
});
export {}