import {Level} from "./Level";
import Point from "../game/Point";

export class Level2 extends Level {
  constructor() {
    super([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      new Point(0, 0),
      [
        new Point(1, 1)
      ],
      new Point(4, 3)
    );
  }
}
