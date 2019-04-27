import Sprite = Phaser.Sprite;
import Point from "./Point";
import {LEVEL_HEIGHT, LEVEL_WIDTH, TILE_SIZE} from "../app";
import {Level} from "./Level";

export class Player {
  private sprite: Sprite;
  private position : Point;
  private leftKey: Phaser.Key;
  private rightKey: Phaser.Key;
  private upKey: Phaser.Key;
  private downKey: Phaser.Key;
  private isMoving: boolean;

  constructor() {
    this.position = new Point(0, 0);
    this.isMoving = false;
  }

  create(game: Phaser.Game) {
    this.sprite = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, 'chips');

    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

    game.camera.follow(this.sprite);
  }

  update(game: Phaser.Game, level: Level) {
    if (this.isMoving) {
      return;
    }

    if (this.leftKey.isDown) {
      this.moveTo(game, level, this.position.left());
    } else if (this.rightKey.isDown) {
      this.moveTo(game, level, this.position.right());
    } else if (this.upKey.isDown) {
      this.moveTo(game, level, this.position.up());
    } else if (this.downKey.isDown) {
      this.moveTo(game, level, this.position.down());
    }
  }

  private moveTo(game: Phaser.Game, level: Level, position: Point) {
    if (!this.isMovingAllowed(level, position)) {
      return;
    }
    this.isMoving = true;
    this.position = position;
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
