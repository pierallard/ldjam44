import {Level} from "./Level";
import Point from "../game/Point";

export class Level1 extends Level {
  constructor() {
    super([
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 1, 1, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      new Point(0, 0),
      [
        new Point(1, 0),
        new Point(2, 0),
      ],
      new Point(9, 5)
    );
  }
}
