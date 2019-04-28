import Sprite = Phaser.Sprite;
import Point from "./Point";
import {TILE_SIZE} from "../app";
import {Level} from "../levels/Level";
import {Positionable} from "./Positionable";
import Tween = Phaser.Tween;
import TimerEvent = Phaser.TimerEvent;

export class Coin {
  static SCARED_DISTANCE = 5;
  static PROBA_FUITE = 0.03;

  protected sprite: Sprite;
  private evilSprite: Sprite;
  protected shadow: Sprite;
  protected position: Point;
  private isMoving = false;
  private id: number;
  private player: Positionable;
  private coins: Coin[];
  private isDead: boolean;
  private tweens: Tween[];
  private timeEvents: TimerEvent[];
  private shadowEvil: Sprite;

  constructor(id: number, position: Point, player: Positionable, coins: Coin[]) {
    this.id = id;
    this.position = position;
    this.isDead = false;
    this.player = player;
    this.coins = coins;
  }

  getPosition = () => this.position;

  isAlive() {
    return !this.isDead;
  }

  create(game: Phaser.Game, normalGroup: Phaser.Group, evilGroup: Phaser.Group) {
    this.tweens = [];
    this.timeEvents = [];
    this.isDead = false;
    this.isMoving = false;

    this.shadow = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, 'shadow');
    this.shadow.anchor.set(0.1, 0.1);
    normalGroup.add(this.shadow);
    this.shadowEvil = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, 'shadow');
    this.shadowEvil.anchor.set(0.1, 0.1);
    evilGroup.add(this.shadowEvil);

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

    if (this.playerIsClose()) {
      if (Math.random() < Coin.PROBA_FUITE) {
        this.runAway(level, game);
        return;
      } else {
        this.playScared();
      }
    } else {
      if (this.sprite.animations.currentAnim.name !== 'IDLE') {
        this.sprite.animations.play('IDLE');
      }
    }

    if (Math.random() < 0.3) {
      if (this.sprite.scale.x < 0) {
        this.sprite.scale.set(1, 1);
        this.sprite.anchor.set(0, 0);
      } else {
        this.sprite.scale.set(-1, 1);
        this.sprite.anchor.set(1, 0);
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

    [this.sprite, this.evilSprite, this.shadowEvil, this.shadow].forEach((sprite) => {
      this.tweens.push(game.add.tween(sprite).to({
        x: position.x * TILE_SIZE,
        y: position.y * TILE_SIZE
      }, 0.3 * Phaser.Timer.SECOND - Phaser.Timer.SECOND / 50, Phaser.Easing.Default, true));
    });

    this.timeEvents.push(game.time.events.add(0.3 * Phaser.Timer.SECOND, () => {
      this.isMoving = false;
      this.position = position;
      this.sprite.position.x = this.position.x * TILE_SIZE;
      this.sprite.position.y = this.position.y * TILE_SIZE;
      this.evilSprite.position.x = this.position.x * TILE_SIZE;
      this.evilSprite.position.y = this.position.y * TILE_SIZE;
    }, this))
  }

  private isMovingAllowed(level: Level, position: Point) {
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
    this.isMoving = true;
  }

  stopMoving(game: Phaser.Game, rightOriented: boolean) {
    this.isMoving = true;
    this.tweens.forEach((tween: Phaser.Tween) => {
      tween.stop(false);
    });
    this.timeEvents.forEach((timeEvent: TimerEvent) => {
      timeEvent.callback = () => {}
    });

    const gapX = 14 * (rightOriented ? 1 : -1);
    const gapY = 3;

    [this.sprite, this.evilSprite, this.shadow, this.shadowEvil].forEach((sprite) => {
      game.add.tween(sprite).to({
        x: this.position.x * TILE_SIZE + gapX,
        y: this.position.y * TILE_SIZE + gapY
      }, 0.3 * Phaser.Timer.SECOND - Phaser.Timer.SECOND / 50, Phaser.Easing.Default, true);
    });
  }

  private playerIsClose() {
    return Coin.dist(this.player.getPosition(), this.position) < Coin.SCARED_DISTANCE;
  }

  protected playScared() {
    this.evilSprite.animations.play('SCARED');
  }

  ressussite() {
    this.sprite.alpha = 1;
    this.evilSprite.alpha = 1;
    this.shadow.alpha = 1;
    this.isDead = false;
    this.isMoving = false;
  }

  reinitialize(position: Point) {
    this.position = position;
    this.sprite.position.x = this.position.x * TILE_SIZE;
    this.sprite.position.y = this.position.y * TILE_SIZE;
    this.evilSprite.position.x = this.position.x * TILE_SIZE;
    this.evilSprite.position.y = this.position.y * TILE_SIZE;
    this.shadow.position.x = this.position.x * TILE_SIZE;
    this.shadow.position.y = this.position.y * TILE_SIZE;
  }

  private runAway(level: Level, game: Phaser.Game) {
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
    } else {
      this.playScared();
    }
  }
}
