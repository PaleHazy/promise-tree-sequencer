import { BaseLevel, Options } from "../../engine/Levels/BaseLevel";
import { LevelDto } from "../../interfaces";

export class DefaultLevel extends BaseLevel {

  constructor(dto: LevelDto, options: Options) {
    super(dto, options);
  }

}
