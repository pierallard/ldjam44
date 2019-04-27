import { Tile } from "./Tile";
import Point from "./Point";
import { LEVEL_HEIGHT, LEVEL_WIDTH } from "../app";
import { Bloc } from "./Bloc";

export class Level {
  private tiles: Tile[];
  private grid: number[][] = [
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0]
  ];

  constructor() {
    this.tiles = [];

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
  }

  getGrid = () => this.grid;

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
