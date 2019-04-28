import {Level} from "./Level";
import Point from "../game/Point";

export class Level1 extends Level {
  constructor() {
    super([
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 1, 1, 0, 1, 1, 0, 1, 0, 0],
        [0, 1, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 1, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      new Point(0, 0), // hero
      [ // coins
        new Point(7, 1),
        new Point(10, 1),
        new Point(3, 3),
        new Point(7, 4),
        new Point(9, 5),
        new Point(1, 6),
        new Point(1, 8),
        new Point(10, 8),
        new Point(6, 10),
      ],
      new Point(9, 1) // playable coin
    );
  }
}
