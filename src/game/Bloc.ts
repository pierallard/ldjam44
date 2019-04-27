import {Tile} from "./Tile";
import {TILE_SIZE} from "../app";

export class Bloc extends Tile {
  create(game: Phaser.Game, normalGroup: Phaser.Group, evilGroup: Phaser.Group) {
    this.normalSprite = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, 'basic_bloc');
    normalGroup.add(this.normalSprite);
    this.evilSprite = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, 'evil_bloc');
    evilGroup.add(this.evilSprite);
  }

  isAllowedForPlayer(): boolean {
    return false;
  }

  isAllowedForCoin(): boolean {
    return false;
  }
}
