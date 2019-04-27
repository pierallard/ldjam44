import Point from "../game/Point";
import { Tile } from "../game/Tile";

export abstract class Level {
  protected tiles: Tile[] = [];

  protected width: number;
  protected height: number;

  abstract getGrid: () => number[][];

  getWidth = () => this.width;

  getHeight = () => this.height;

  constructor() {

  }

  create(
    game: Phaser.Game,
    normalGroup: Phaser.Group,
    evilGroup: Phaser.Group
  ) {


    this.tiles.forEach(tile => {
      tile.create(game, normalGroup, evilGroup);
    });
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
