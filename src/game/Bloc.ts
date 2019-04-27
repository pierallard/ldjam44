import {Tile} from "./Tile";
import {TILE_SIZE} from "../app";

export class Bloc extends Tile {
  create(game: Phaser.Game, group: Phaser.Group) {
    this.sprite = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, 'basic_bloc');
    group.add(this.sprite);
  }

  isAllowedForPlayer(): boolean {
    return false;
  }
}
