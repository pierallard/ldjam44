import Sprite = Phaser.Sprite;
import Point from "./Point";
import {TILE_SIZE} from "../app";
import { Level } from "../levels/Level";

export class PlayableCoin {
  private sprite: Sprite;
  public position : Point;
  private leftKey: Phaser.Key;
  private rightKey: Phaser.Key;
  private upKey: Phaser.Key;
  private downKey: Phaser.Key;
  private isMoving: boolean;
  private shadow: Sprite;
  private normalSprite: Sprite;
  private dead: boolean;

  constructor(position: Point) {
    this.position = position;
    this.isMoving = false;
  }

  create(game: Phaser.Game, evilGroup: Phaser.Group, normalGroup: Phaser.Group) {
    this.isMoving = false;
    this.dead = false;
    this.shadow = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, 'shadow');
    evilGroup.add(this.shadow);
    normalGroup.add(this.shadow);
    this.shadow.anchor.set(0.1, 0.1);
    this.sprite = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, 'coin');
    this.sprite.animations.add('IDLE', [0, 1, 2], Phaser.Timer.SECOND / 100, true);
    this.sprite.animations.add('RUN', [3, 4, 5, 6, 7, 8], Phaser.Timer.SECOND / 50, true);
    this.sprite.animations.play('IDLE');
    evilGroup.add(this.sprite);

    this.normalSprite = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, "normal_coin");
    normalGroup.add(this.normalSprite);
    this.normalSprite.animations.add('IDLE', [0, 1, 2, 3, 4, 5], Phaser.Timer.SECOND / 70, true);
    this.normalSprite.animations.play('IDLE');

    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  }

  followCamera(game: Phaser.Game) {
    game.camera.follow(this.sprite);
  }

  update(game: Phaser.Game, level): boolean {
    if (this.isMoving) {
      return false;
    }

    if (this.leftKey.isDown) {
      this.moveTo(game, this.position.left(), level);
      return true;
    } else if (this.rightKey.isDown) {
      this.moveTo(game, this.position.right(), level);
      return true;
    } else if (this.upKey.isDown) {
      this.moveTo(game, this.position.up(), level);
      return true;
    } else if (this.downKey.isDown) {
      this.moveTo(game, this.position.down(), level);
      return true;
    } else {
      if (this.sprite.animations.currentAnim.name !== 'IDLE') {
        this.sprite.animations.play('IDLE');
      }
    }

    return false;
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
    this.position = position;

    [this.sprite, this.normalSprite, this.shadow].forEach((sprite) => {
      game.add.tween(sprite).to({
        x: this.position.x * TILE_SIZE,
        y: this.position.y * TILE_SIZE
      }, 0.3 * Phaser.Timer.SECOND, Phaser.Easing.Default, true);
    });

    game.time.events.add(0.3 * Phaser.Timer.SECOND, () => {
      this.isMoving = false;
      this.sprite.position.x = this.position.x * TILE_SIZE;
      this.sprite.position.y = this.position.y * TILE_SIZE;
    }, this)
  }

  private isMovingAllowed(position: Point, level: Level) {
    if (!level.isAllowedForCoin(position)) {
      return false;
    }

    return true;
  }

  setPosition(point: Point) {
    this.position = point;
    this.sprite.position.x = this.position.x * TILE_SIZE;
    this.sprite.position.y = this.position.y * TILE_SIZE;
    this.shadow.position.x = this.position.x * TILE_SIZE;
    this.shadow.position.y = this.position.y * TILE_SIZE;
  }

  kill() {
    this.dead = true;
    this.sprite.animations.play('DIE');
    this.sprite.alpha = 0;
    this.normalSprite.alpha = 0;
    this.shadow.alpha = 0;
  }

  getPosition() {
    return this.position;
  }

  isAlive() {
    return !this.dead;
  }

  ressussite() {
    this.sprite.alpha = 1;
    this.normalSprite.alpha = 1;
    this.shadow.alpha = 1;
    this.dead = false;
  }
}
