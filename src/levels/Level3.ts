import {Level} from "./Level";
import Point from "../game/Point";

export class Level3 extends Level {
  constructor() {
    super([
        [1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0],
        [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
        [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0],
        [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0],
        [1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0],
        [0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
      ],
      new Point(4, 4), // hero
      [ // coins
        //new Point(0, 0),
        //new Point(9, 0),
        //new Point(4, 1),
        new Point(1, 4),
        //new Point(7, 4),
        //new Point(9, 4),
        //new Point(4, 7),
        //new Point(2, 9),
        //new Point(9, 9),
      ],
      new Point(6, 6) // playable coin
    );
  }

  getStageNumber() {
    return '3';
  }

  getNormalMessage() {
    return "I don't feel so great...\n\nHow could I stop this?"
  }

  shouldGlitch() {
    return true;
  }
}

