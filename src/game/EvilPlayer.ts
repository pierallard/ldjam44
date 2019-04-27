import Sprite = Phaser.Sprite;
import Point from "./Point";
import { TILE_SIZE, LEVEL_WIDTH, LEVEL_HEIGHT } from "../app";
import {PlayableCoin} from "./PlayableCoin";
import {Level} from "./Level";

export class EvilPlayer {
  private sprite: Sprite;
  private position: Point;
  private isMoving: boolean;
  private target: PlayableCoin;

  constructor(target: PlayableCoin, position) {
    this.position = position;
    this.isMoving = false;
    this.target = target;
  }

  create(game: Phaser.Game) {
    this.sprite = game.add.sprite(
      this.position.x * TILE_SIZE,
      this.position.y * TILE_SIZE,
        "chips",
        32
    );
  }

  update(game: Phaser.Game, level: Level) {
    if (this.isMoving) {
      return;
    }

    let distanceX = this.target.position.x - this.position.x;
    let distanceY = this.target.position.y - this.position.y;
    switch (true) {
      case distanceX === 0:
        break;
      case distanceX > 0:
        this.moveTo(game, this.position.right(), level);
        break;
      case distanceX < 0:
        this.moveTo(game, this.position.left(), level);
        break;
      case distanceY < 0:
        this.moveTo(game, this.position.up(), level);
        break;
      case distanceY > 0:
        this.moveTo(game, this.position.down(), level);
        break;
    }

    let horizontalMovement = this.target.position.x > this.position.x ? 'right' : 'left';
    this.moveTo(game, this.target.position[horizontalMovement](), level);

    let verticalMovement = this.target.position.y > this.position.y ? 'down' : 'up';
    this.moveTo(game, this.target.position[verticalMovement](), level);
  }

  private moveTo(game: Phaser.Game, position: Point, level) {
    if (!this.isMovingAllowed(position, level)) {
      return;
    }

    this.isMoving = true;
    this.position = position;

    game.add.tween(this.sprite).to(
      {
        x: this.position.x * TILE_SIZE,
        y: this.position.y * TILE_SIZE
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
      },
      this
    );
  }

  private isMovingAllowed(position: Point, level) {
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
