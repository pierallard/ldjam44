import { Level } from "./Level";
import Point from "../game/Point";
import {Bloc} from "../game/Bloc";
import {Tile} from "../game/Tile";

export class Level2 extends Level {
  constructor() {
    super();

    const grid = this.getGrid();

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        switch (grid[y][x]) {
          case 0:
            this.tiles.push(new Tile(new Point(x, y)));
            break;
          case 1:
            this.tiles.push(new Bloc(new Point(x, y)));
            break;
        }
      }
    }

    this.width = 10;
    this.height = 5;
  }

  getGrid = () => [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
}
