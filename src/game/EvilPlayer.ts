import Sprite = Phaser.Sprite;
import Point from "./Point";
import { TILE_SIZE } from "../app";
import { PlayableCoin } from "./PlayableCoin";
import { Level } from "../levels/Level";
import { js as EasyStar } from "easystarjs";
import {Positionable} from "./Positionable";
import {Coin} from "./Coin";
import Game = Phaser.Game;

type Path = { x: number; y: number }[];

export class EvilPlayer implements Positionable {
  private static SPEED = 0.22 * Phaser.Timer.SECOND;
  private sprite: Sprite;
  private position: Point;
  private isMoving: boolean;
  private target: PlayableCoin;
  private shadow: Sprite;
  private coins: Coin[];
  private normalPlayerIsKilling: boolean = false;
  private visible: boolean;
  canMove: boolean;

  private path: Path = null;
  private calculatingPath = false;

  constructor(private pathfinder: EasyStar, target: PlayableCoin, position) {
    this.position = position;
    this.isMoving = false;
    this.target = target;
    this.visible = true;
  }

  create(game: Phaser.Game, group: Phaser.Group) {
    this.canMove = true;
    this.shadow = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, 'shadow');
    group.add(this.shadow);
    this.shadow.anchor.set(0.1, 0.1);

    this.sprite = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, 'evil_hero');

    this.sprite.animations.add('IDLE', [0, 1, 2, 3], Phaser.Timer.SECOND / 150, true);
    this.sprite.animations.add('RUN', [4, 5, 6, 7, 8, 9], Phaser.Timer.SECOND / 100, true);
    this.sprite.animations.add('KILL1', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], Phaser.Timer.SECOND / 100, true);
    //this.sprite.animations.add('KILL2', [15, 16, 17], Phaser.Timer.SECOND / 100, false);
    this.sprite.animations.play('IDLE');
    this.sprite.anchor.set(0.3, 0.3);

    group.add(this.sprite);
  }

  update(game: Phaser.Game, level: Level) {
    if (!this.visible) {
      return;
    }
    if (this.isMoving) {
      return;
    }
    if (this.normalPlayerIsKilling) {
      return;
    }
    if (!this.canMove) {
      return;
    }

    const coin = this.canKill();
    if (coin) {
      this.kill(game, coin);
      return;
    }

    this.pathfinder.calculate();
    if (this.calculatingPath) {
      return;
    }
    if (this.isPathUpdateRequired()) {
      this.pathfinder.findPath(
        this.position.x,
        this.position.y,
        this.target.position.x,
        this.target.position.y,
        path => {
          this.calculatingPath = false;
          this.path = path;
          if (this.path !== null) {
            path.shift(); // drop the first element (it's the current position).
          }
        }
      );
      this.calculatingPath = true;
      return;
    }

    const destination = this.path.shift();
    const point = new Point(destination.x, destination.y);
    if (!point.equals(this.position)) {
      this.moveTo(game, level, point);
    }
  }

  private isPathUpdateRequired = () => {
    if (this.calculatingPath) {
      return false;
    }
    if (!this.path || this.path.length === 0) {
      return true;
    }
    if (this.position.equals(this.target.position)) {
      return true;
    }

    return false;
  };


  moveTo(game: Phaser.Game, level: Level, position: Point, speed: number = null) {
    if (!this.isMovingAllowed(level, position)) {
      return;
    }
    this.isMoving = true;
    if (this.position.x < position.x) {
      this.sprite.scale.set(1, 1);
      this.sprite.anchor.set(0.3, 0.3);
    } else if (this.position.x > position.x) {
      this.sprite.scale.set(-1, 1);
      this.sprite.anchor.set(0.7, 0.3);
    }
    this.sprite.animations.play('RUN');
    game.add.tween(this.sprite).to({
      x: position.x * TILE_SIZE,
      y: position.y * TILE_SIZE
    }, speed || EvilPlayer.SPEED, Phaser.Easing.Default, true);

    game.add.tween(this.shadow).to({
      x: position.x * TILE_SIZE,
      y: position.y * TILE_SIZE
    }, speed || EvilPlayer.SPEED, Phaser.Easing.Default, true);

    game.time.events.add(speed || EvilPlayer.SPEED, () => {
      this.position = position;
      this.isMoving = false;
      this.sprite.position.x = this.position.x * TILE_SIZE;
      this.sprite.position.y = this.position.y * TILE_SIZE;
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
    if (!level.isAllowedForPlayer(position)) {
      return false;
    }

    return true;
  }

  getPosition() {
    return this.position;
  }

  setCoins(coins: Coin[]) {
    this.coins = coins;
  }

  private canKill(): Coin {
    const coins = this.coins.filter((coin) => {
      return coin.getPosition().equals(this.position) && coin.isAlive();
    });
    if (coins.length) {
      return coins[0];
    }
    return null;
  }

  private kill(game: Game, coin: Coin) {
    this.isMoving = true;
    this.playKill();
    coin.stopMoving(game, this.sprite.scale.x > 0);
    game.time.events.add(Phaser.Timer.SECOND * 1, () => {
      this.sprite.animations.play('IDLE');
      this.isMoving = false;
      coin.kill();
    }, this)
  }

  setPosition(point: Point) {
    this.position = point;
    this.sprite.position.x = this.position.x * TILE_SIZE;
    this.sprite.position.y = this.position.y * TILE_SIZE;
    this.shadow.position.x = this.position.x * TILE_SIZE;
    this.shadow.position.y = this.position.y * TILE_SIZE;
  }

  playKillAnimationTimeboxed(game: Phaser.Game, duration: number) {
    this.normalPlayerIsKilling = true;
    this.playKill();
    game.time.events.add(duration, () => {
      this.normalPlayerIsKilling = false;
    });
  }

  playKill() {
    const animations = ['KILL1'];
    const anim = animations[Math.floor(Math.random() * animations.length)];
    this.sprite.animations.play(anim);
  }

  playIdle() {
    this.sprite.animations.play('IDLE');
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (!this.visible) {
      this.sprite.alpha = 0;
      this.shadow.alpha = 0;
    } else {
      this.sprite.alpha = 1;
      this.shadow.alpha = 1;
    }
  }
}
