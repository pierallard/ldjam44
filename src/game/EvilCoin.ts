import {Coin} from "./Coin";
import {TILE_SIZE} from "../app";
import Point from "./Point";
import {Level} from "../levels/Level";

export class EvilCoin extends Coin {
  create(game: Phaser.Game, group: Phaser.Group) {
    this.shadow = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, 'shadow');
    this.shadow.anchor.set(0.1, 0.1);
    group.add(this.shadow);
    this.sprite = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, "evil_coin");
    group.add(this.sprite);

    this.sprite.animations.add('IDLE', [0, 1, 2, 3, 4, 5, 6], Phaser.Timer.SECOND / 70, true);
    this.sprite.animations.add('RUN', [7, 8, 9, 10, 11, 12], Phaser.Timer.SECOND / 70, true);
    this.sprite.animations.add('SCARED', [13, 14], Phaser.Timer.SECOND / 70, true);
    this.sprite.animations.play('IDLE');
  }

  protected moveTo(game: Phaser.Game, level: Level, position: Point) {
    if (!this.position.equals(position) && this.sprite.animations.currentAnim.name !== 'RUN') {
      this.sprite.animations.play('RUN');
    }

    super.moveTo(game, level, position);
  }

  protected playScared() {
    this.sprite.animations.play('SCARED');
  }
}