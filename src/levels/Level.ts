import { Bloc } from "../game/Bloc";
import Point from "../game/Point";
import { Tile } from "../game/Tile";

export abstract class Level {
  private tiles: Tile[] = [];

  private width: number;
  private height: number;

  getGrid: () => number[][];

  getWidth = () => this.width;

  getHeight = () => this.height;

  create(
    game: Phaser.Game,
    normalGroup: Phaser.Group,
    evilGroup: Phaser.Group
  ) {
    const grid = this.getGrid();

    this.width = this.getGrid()[0].length;
    this.height = this.getGrid().length;

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
