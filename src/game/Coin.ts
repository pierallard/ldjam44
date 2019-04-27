import Sprite = Phaser.Sprite;
import Point from "./Point";
import {TILE_SIZE} from "../app";
import {Level} from "../levels/Level";
import {Positionable} from "./Positionable";

export class Coin {
  protected sprite: Sprite;
  private evilSprite: Sprite;
  protected shadow: Sprite;
  protected position: Point;
  private isMoving = false;

  private isDead: boolean;

  constructor(private id,
              position,
              private player: Positionable,
              private coins: Coin[]) {
    this.position = position;
    this.isDead = false;
  }

  getPosition = () => this.position;

  isAlive() {
    return !this.isDead;
  }

  create(game: Phaser.Game, normalGroup: Phaser.Group, evilGroup: Phaser.Group) {
    this.shadow = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, 'shadow');
    this.shadow.anchor.set(0.1, 0.1);
    normalGroup.add(this.shadow);
    evilGroup.add(this.shadow);

    this.sprite = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, "normal_coin");
    normalGroup.add(this.sprite);
    this.sprite.animations.add('IDLE', [0, 1, 2, 3, 4, 5], Phaser.Timer.SECOND / 70, true);
    this.sprite.animations.play('IDLE');

    this.evilSprite = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, "evil_coin");
    evilGroup.add(this.evilSprite);
    this.evilSprite.animations.add('IDLE', [0, 1, 2, 3, 4, 5, 6], Phaser.Timer.SECOND / 70, true);
    this.evilSprite.animations.add('RUN', [7, 8, 9, 10, 11, 12], Phaser.Timer.SECOND / 70, true);
    this.evilSprite.animations.add('SCARED', [13, 14], Phaser.Timer.SECOND / 70, true);
    this.evilSprite.animations.play('IDLE');
  }

  update(game: Phaser.Game, level: Level) {
    if (this.isDead) {
      return;
    }
    if (this.isMoving) {
      return;
    }

    if (Math.random() < 0.03 && this.playerIsClose()) {
      this.playScared();
      const possiblePositions = [
        this.position, this.position.left(), this.position.right(), this.position.up(), this.position.down()
      ];
      const availablePositions = possiblePositions.filter((position) => {
        return this.isMovingAllowed(level, position);
      });

      const playerPosition = this.player.getPosition();
      if (availablePositions.length) {
        const sortedPositions = availablePositions.sort((a, b) => {
          return Coin.dist(playerPosition, b) - Coin.dist(playerPosition, a);
        });
        this.moveTo(game, level, sortedPositions[0]);

      }
      return;
    } else {
      if (Math.random() < 0.03) {
        if (this.sprite.scale.x < 0) {
          this.sprite.scale.set(1, 1);
          this.sprite.anchor.set(0, 0);
        } else {
          this.sprite.scale.set(-1, 1);
          this.sprite.anchor.set(1, 0);
        }
      }
      if (this.sprite.animations.currentAnim.name !== 'IDLE') {
        this.sprite.animations.play('IDLE');
      }
    }
  }

  protected moveTo(game: Phaser.Game, level: Level, position: Point) {
    if (!this.isMovingAllowed(level, position)) {
      return;
    }
    if (!this.position.equals(position) && this.sprite.animations.currentAnim.name !== 'RUN') {
      this.sprite.animations.play('RUN');
    }
    this.isMoving = true;
    if (this.position.x < position.x) {
      this.sprite.scale.set(1, 1);
      this.sprite.anchor.set(0, 0);
      this.evilSprite.scale.set(1, 1);
      this.evilSprite.anchor.set(0, 0);
    } else if (this.position.x > position.x) {
      this.evilSprite.scale.set(-1, 1);
      this.evilSprite.anchor.set(1, 0);
    }

    this.position = position;

    game.add.tween(this.sprite).to({
      x: position.x * TILE_SIZE,
      y: position.y * TILE_SIZE
    }, 0.3 * Phaser.Timer.SECOND - Phaser.Timer.SECOND / 50, Phaser.Easing.Default, true);

    game.add.tween(this.evilSprite).to({
      x: position.x * TILE_SIZE,
      y: position.y * TILE_SIZE
    }, 0.3 * Phaser.Timer.SECOND - Phaser.Timer.SECOND / 50, Phaser.Easing.Default, true);

    game.add.tween(this.shadow).to({
      x: position.x * TILE_SIZE,
      y: position.y * TILE_SIZE
    }, 0.3 * Phaser.Timer.SECOND - Phaser.Timer.SECOND / 50, Phaser.Easing.Default, true);

    game.time.events.add(0.3 * Phaser.Timer.SECOND, () => {
      this.isMoving = false;
      this.sprite.position.x = this.position.x * TILE_SIZE;
      this.sprite.position.y = this.position.y * TILE_SIZE;
      this.evilSprite.position.x = this.position.x * TILE_SIZE;
      this.evilSprite.position.y = this.position.y * TILE_SIZE;
    }, this)
  }

  private isMovingAllowed(level: Level, position: Point) {
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

    for (const coin of this.coins) {
      if (coin.id === this.id) {
        continue;
      }
      if (coin.getPosition().equals(position)) {
        return false;
      }
    }

    return true;
  }

  private static dist(playerPosition: Point, position: Point) {
    return Math.sqrt(
      (playerPosition.x - position.x) * (playerPosition.x - position.x) +
      (playerPosition.y - position.y) * (playerPosition.y - position.y)
    )
  }

  kill() {
    this.sprite.alpha = 0;
    this.evilSprite.alpha = 0;
    this.shadow.alpha = 0;
    this.isDead = true;
  }

  stopMoving() {
    this.isMoving = true;
  }

  private playerIsClose() {
    return Coin.dist(this.player.getPosition(), this.position) < 5
  }

  protected playScared() {
    this.evilSprite.animations.play('SCARED');
  }

  ressussite() {
    this.sprite.alpha = 1;
    this.evilSprite.alpha = 1;
    this.shadow.alpha = 1;
    this.isDead = false;
  }
}
