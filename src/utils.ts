import { BaseAction } from "./engine/Actions/BaseAction";
import { BaseLevel } from "./engine/Levels/BaseLevel";
import { BaseTask } from "./engine/Tasks/BaseTask";
import { Actions, Levels, Tasks } from "./interfaces";

export function isRoot(level: BaseLevel) {
  return level.root === level;
}
const LOG = false;
function logLvl(node: Levels) {
  const lt = `%c[Level]: ${node.name}\n`
  const lc = `color: ${node.colors.color}; background: ${node.colors.bg};`
  return {lt, lc}
}
function logTask(node: Tasks) {
  const tt = `%c[Task]: ${node.name}\n`
  const tc = `color: ${node.colors.color}; background: ${node.colors.bg};`
  return {tc, tt}
}
function logAction(node: Actions) {
  const at = `%c[Action]: ${node.name}\n`
  const ac = `color: ${node.colors.color}; background: ${node.colors.bg};`
  return {ac, at}
}
export function log(node: Levels | Tasks | Actions, ...args: any[]) {
  if(!LOG) {
    return;
  }

  if (node instanceof BaseLevel) {
     const {lc,lt} = logLvl(node);
     console.log(
      ...[lt,lc],
      ...args
    );
  } else if (node instanceof BaseTask) {
    const {lc,lt} = logLvl(node.level);
    const {tc,tt} = logTask(node);
    console.log(lt + tt, lc, tc, ...args);
  } else if (node instanceof BaseAction) {
    const {lc,lt} = logLvl(node.task.level);
    const {tc,tt} = logTask(node.task);
    const {ac,at} = logAction(node);
    console.log(lt + tt + at, lc, tc, ac, ...args);
  }
}

export function randomContrastColors() {
  let r = Math.floor(Math.random() * 256 - 1);
  let g = Math.floor(Math.random() * 256 - 1);
  let b = Math.floor(Math.random() * 256 - 1);
  // Calculate brightness of randomized colour
  let brightness = (r * 299 + g * 587 + b * 114) / 1000;
  // Calculate brightness of white and black text
  let lightText = (255 * 299 + 255 * 587 + 255 * 114) / 1000;
  let darkText = (0 * 299 + 0 * 587 + 0 * 114) / 1000;

  // Apply background colour to current element
  let bg = "rgb(" + r + "," + g + "," + b + ")";

  // Determine contrast of colour for element text and assign either white or black text depending
  let color = "";
  if (Math.abs(brightness - lightText) > Math.abs(brightness - darkText)) {
    color = "rgb(255, 255, 255)";
  } else {
    color = "rgb(0, 0, 0)";
  }
  return { bg, color };
}

export function touchAllLevels(level: Levels, cb: (level: Levels) => void) {
  cb(level);
  for (const child of level.levelBuffer) {
    touchAllLevels(child, cb);
  }
} 