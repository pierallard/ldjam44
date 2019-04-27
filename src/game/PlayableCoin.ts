import Sprite = Phaser.Sprite;
import Point from "./Point";
import {TILE_SIZE} from "../app";
import { Level } from "../levels/Level";

export class PlayableCoin {
  private sprite: Sprite;
  public readonly position : Point;
  private leftKey: Phaser.Key;
  private rightKey: Phaser.Key;
  private upKey: Phaser.Key;
  private downKey: Phaser.Key;
  private isMoving: boolean;

  constructor() {
    this.position = new Point(3, 3);
    this.isMoving = false;
  }

  create(game: Phaser.Game, group: Phaser.Group) {
    this.sprite = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, 'coin');
    this.sprite.animations.add('IDLE', [0, 1, 2], Phaser.Timer.SECOND / 100, true);
    this.sprite.animations.add('RUN', [3, 4, 5, 6, 7, 8], Phaser.Timer.SECOND / 50, true);

    this.sprite.animations.play('IDLE');
    group.add(this.sprite);

    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  }

  followCamera(game: Phaser.Game) {
    game.camera.follow(this.sprite);
  }

  update(game: Phaser.Game, level) {
    if (this.isMoving) {
      return;
    }

    if (this.leftKey.isDown) {
      this.moveTo(game, this.position.left(), level);
    } else if (this.rightKey.isDown) {
      this.moveTo(game, this.position.right(), level);
    } else if (this.upKey.isDown) {
      this.moveTo(game, this.position.up(), level);
    } else if (this.downKey.isDown) {
      this.moveTo(game, this.position.down(), level);
    } else {
      if (this.sprite.animations.currentAnim.name !== 'IDLE') {
        this.sprite.animations.play('IDLE');
      }
    }
  }

  private moveTo(game: Phaser.Game, position: Point, level) {
    if (!this.isMovingAllowed(position, level)) {
      return;
    }
    if (this.sprite.animations.currentAnim.name !== 'RUN') {
      this.sprite.animations.play('RUN');
    }
    if (this.position.x > position.x) {
      this.sprite.scale.set(-1, 1);
      this.sprite.anchor.set(1, 0);
    } else {
      this.sprite.scale.set(1, 1);
      this.sprite.anchor.set(0, 0);
    }
    this.isMoving = true;
    this.position.x = position.x;
    this.position.y = position.y;
    game.add.tween(this.sprite).to({
      x: this.position.x * TILE_SIZE,
      y: this.position.y * TILE_SIZE
    }, 0.3 * Phaser.Timer.SECOND, Phaser.Easing.Default, true);

    game.time.events.add(0.3 * Phaser.Timer.SECOND, () => {
      this.isMoving = false;
      this.sprite.position.x = this.position.x * TILE_SIZE;
      this.sprite.position.y = this.position.y * TILE_SIZE;
    }, this)
  }

  private isMovingAllowed(position: Point, level: Level) {
    if (position.x < 0) {
      return false;
    }
    if (position.x >= level.getWidth()) {
      return false;
    }
    if (position.y < 0) {
      return false;
    }
    if (position.y >= level.getHeight()) {
      return false;
    }
    if (!level.isAllowedForCoin(position)) {
      return false;
    }

    return true;
  }
}
