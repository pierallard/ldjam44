import {Level} from "./Level";
import Point from "../game/Point";

export class Level1 extends Level {
  constructor() {
    super([
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1],
        [0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
        [0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
        [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      new Point(0, 0), // hero
      [ // coins
        //new Point(6, 0),
        //new Point(9, 0),
        //new Point(2, 2),
        //new Point(6, 3),
        //new Point(8, 4),
        // new Point(0, 5),
        new Point(4, 0),
        new Point(5, 0),
        new Point(6, 0),
        //new Point(0, 7),
        //new Point(9, 7),
        //new Point(5, 9),
      ],
      new Point(8, 0) // playable coin
    );
  }

  getStageNumber() {
    return '1';
  }

  getNormalMessage() {
    return "Life is cool for a\n\nnaked amazon. Typical\n\ndaily currency hunt!"
  }
}
