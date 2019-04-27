import Sprite = Phaser.Sprite;
import Point from "./Point";
import { TILE_SIZE, LEVEL_WIDTH, LEVEL_HEIGHT } from "../app";
import { PlayableCoin } from "./PlayableCoin";
import { Level } from "./Level";
import { js as EasyStar } from "easystarjs";
import {Positionable} from "./Positionable";

type Path = { x: number; y: number }[];

export class EvilPlayer implements Positionable {
  private static SPEED = 0.3 * Phaser.Timer.SECOND;
  private sprite: Sprite;
  private position: Point;
  private isMoving: boolean;
  private target: PlayableCoin;

  private path: Path = null;
  private calculatingPath = false;

  constructor(private pathfinder: EasyStar, target: PlayableCoin, position) {
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

  getPosition() {
    return this.position;
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
