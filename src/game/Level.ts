import {Tile} from "./Tile";
import Point from "./Point";
import {LEVEL_HEIGHT, LEVEL_WIDTH} from "../app";
import {Bloc} from "./Bloc";

export class Level {
  private tiles: Tile[];

  constructor() {
    this.tiles = [];

    const blocks = [
      new Point(2, 0),
      new Point(2,2)
    ];

    for (let y = 0; y < LEVEL_HEIGHT; y++) {
      for (let x = 0; x < LEVEL_WIDTH; x++) {
        const position = new Point(x, y);
        if (blocks.filter((block) => {
          return block.equals(position);
        }).length === 0) {
          this.tiles.push(new Tile(position));
        } else {
          this.tiles.push(new Bloc(position));
        }
      }
    }
  }

  create(game: Phaser.Game, normalGroup: Phaser.Group, evilGroup: Phaser.Group) {
    this.tiles.forEach((tile) => {
      tile.create(game, normalGroup, evilGroup);
    })
  }

  isAllowedForPlayer(position: Point) {
    for (let i = 0; i < this.tiles.length; i++) {
      if (this.tiles[i].getPosition().equals(position)) {
        return this.tiles[i].isAllowedForPlayer();
      }
    }
  }

  isAllowedForCoin(position: Point) {
    for (let i = 0; i < this.tiles.length; i++) {
      if (this.tiles[i].getPosition().equals(position)) {
        return this.tiles[i].isAllowedForCoin();
      }
    }
  }
}
