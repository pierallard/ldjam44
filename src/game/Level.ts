import {Tile} from "./Tile";
import Point from "./Point";

export class Level {
  private tiles: Tile[];


  constructor() {
    this.tiles = [];

    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
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
