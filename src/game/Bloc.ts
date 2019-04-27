import {Tile} from "./Tile";
import {TILE_SIZE} from "../app";

export class Bloc extends Tile {
  create(game: Phaser.Game) {
    this.sprite = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, 'basic_bloc');
  }

  isAllowedForPlayer(): boolean {
    return false;
  }
}
