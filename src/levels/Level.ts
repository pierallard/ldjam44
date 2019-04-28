import Point from "../game/Point";
import { Tile } from "../game/Tile";
import {Bloc} from "../game/Bloc";

export class Level {
  protected tiles: Tile[] = [];

  protected width: number;
  protected height: number;

  getWidth = () => this.width;

  getHeight = () => this.height;

  private grid: number[][];

  constructor(levelDescriptor: number[][]) {
    this.grid = levelDescriptor;

    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        switch (this.grid[y][x]) {
          case 0:
            this.tiles.push(new Tile(new Point(x, y)));
            break;
          case 1:
            this.tiles.push(new Bloc(new Point(x, y)));
            break;
        }
      }
    }

    this.width = this.grid[0].length;
    this.height = this.grid.length;
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

  getGrid(): number[][] {
    return this.grid;
  }
}
