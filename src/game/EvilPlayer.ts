import Sprite = Phaser.Sprite;
import Point from "./Point";
import { TILE_SIZE, LEVEL_WIDTH, LEVEL_HEIGHT } from "../app";
import {PlayableCoin} from "./PlayableCoin";
import {Level} from "./Level";


export class EvilPlayer {
  private static SPEED = 0.3 * Phaser.Timer.SECOND;
  private sprite: Sprite;
  private position: Point;
  private isMoving: boolean;
  private target: PlayableCoin;

  constructor(target: PlayableCoin, position) {
    this.position = position;
    this.isMoving = false;
    this.target = target;
  }

  create(game: Phaser.Game, group: Phaser.Group) {
    this.sprite = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, 'evil_hero');

    this.sprite.animations.add('IDLE', [0, 1, 2, 3], Phaser.Timer.SECOND / 150, true);
    this.sprite.animations.add('RUN', [4, 5, 6, 7], Phaser.Timer.SECOND / 100, true);
    this.sprite.animations.play('IDLE');
    this.sprite.anchor.set(0.1, 0.1);

    group.add(this.sprite);
  }

  update(game: Phaser.Game, level: Level) {
    if (this.isMoving) {
      return;
    }

    let distanceX = this.target.position.x - this.position.x;
    let distanceY = this.target.position.y - this.position.y;
    switch (true) {
      case distanceX === 0 && distanceY === 0:
        if (this.sprite.animations.currentAnim.name !== 'IDLE') {
          this.sprite.animations.play('IDLE');
        }
        break;
      case distanceX > 0:
        this.moveTo(game, level, this.position.right());
        break;
      case distanceX < 0:
        this.moveTo(game, level, this.position.left());
        break;
      case distanceY < 0:
        this.moveTo(game, level, this.position.up());
        break;
      case distanceY > 0:
        this.moveTo(game, level, this.position.down());
        break;
    }
  }


  private moveTo(game: Phaser.Game, level: Level, position: Point) {
    if (!this.isMovingAllowed(level, position)) {
      return;
    }
    this.isMoving = true;
    if (this.position.x < position.x) {
      this.sprite.scale.set(1, 1);
      this.sprite.anchor.set(0.1, 0.1);
    } else if (this.position.x > position.x) {
      this.sprite.scale.set(-1, 1);
      this.sprite.anchor.set(0.9, 0.1);
    }
    this.sprite.animations.play('RUN');
    game.add.tween(this.sprite).to({
      x: position.x * TILE_SIZE,
      y: position.y * TILE_SIZE
    }, EvilPlayer.SPEED, Phaser.Easing.Default, true);

    game.time.events.add(EvilPlayer.SPEED, () => {
      this.position = position;
      this.isMoving = false;
      this.sprite.position.x = this.position.x * TILE_SIZE;
      this.sprite.position.y = this.position.y * TILE_SIZE;
    }, this)
  }

  /*
  private moveTo(game: Phaser.Game, position: Point, level) {
    if (!this.isMovingAllowed(position, level)) {
      return;
    }

    this.isMoving = true;
    if (this.position.x < position.x) {
      this.sprite.scale.set(1, 1);
      this.sprite.anchor.set(0.1, 0.1);
    } else if (this.position.x > position.x) {
      this.sprite.scale.set(-1, 1);
      this.sprite.anchor.set(0.9, 0.1);
    }
    game.add.tween(this.sprite).to(
      {
        x: position.x * TILE_SIZE,
        y: position.y * TILE_SIZE
      },
      0.3 * Phaser.Timer.SECOND,
      Phaser.Easing.Default,
      true
    );

    game.time.events.add(
      0.3 * Phaser.Timer.SECOND,
      () => {
        this.isMoving = false;
        this.sprite.position.x = this.position.x * TILE_SIZE;
        this.sprite.position.y = this.position.y * TILE_SIZE;
        this.position = position;
      },
      this
    );
  }*/

  private isMovingAllowed(level: Level, position: Point) {
    if (position.x < 0) {
      return false;
    }
    if (position.x >= LEVEL_WIDTH) {
      return false;
    }
    if (position.y < 0) {
      return false;
    }
    if (position.y >= LEVEL_HEIGHT) {
      return false;
    }
    if (!level.isAllowedForPlayer(position)) {
      return false;
    }

    return true;
  }
}
