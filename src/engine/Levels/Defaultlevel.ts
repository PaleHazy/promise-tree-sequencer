import { BaseLevel, Options } from "./BaseLevel";
import { LevelDto } from "../../interfaces";

export class DefaultLevel extends BaseLevel {

  constructor(dto: LevelDto, options: Options) {
    super(dto, options);
  }

}
