import {Tile} from "./Tile";
import {TILE_SIZE} from "../app";

export class Bloc extends Tile {
  create(game: Phaser.Game, normalGroup: Phaser.Group, evilGroup: Phaser.Group) {
    const variant = Math.ceil(Math.random() * 2);
    let spriteName = '';
    let evilSpriteName = '';

    switch (variant) {
      case 1:
        spriteName = 'bloc_box';
        evilSpriteName = 'evil_bloc_box';
        break;
      case 2:
        spriteName = 'bloc_stone';
        evilSpriteName = 'evil_bloc_stone';
        break;
    }

    this.normalSprite = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, spriteName);
    normalGroup.add(this.normalSprite);
    this.evilSprite = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, evilSpriteName);
    evilGroup.add(this.evilSprite);
  }

  isAllowedForPlayer(): boolean {
    return false;
  }

  isAllowedForCoin(): boolean {
    return false;
  }
}
