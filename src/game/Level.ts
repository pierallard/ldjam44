import {Tile} from "./Tile";
import Point from "./Point";
import {LEVEL_HEIGHT, LEVEL_WIDTH} from "../app";

export class Level {
  private tiles: Tile[];


  constructor() {
    this.tiles = [];

    for (let y = 0; y < LEVEL_HEIGHT; y++) {
      for (let x = 0; x < LEVEL_WIDTH; x++) {
        this.tiles.push(new Tile(new Point(x, y)));
      }
    }
  }

  create(game: Phaser.Game) {
    this.tiles.forEach((tile) => {
      tile.create(game);
    })
  }
}
