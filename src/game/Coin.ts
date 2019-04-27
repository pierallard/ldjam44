import Sprite = Phaser.Sprite;
import Point from "./Point";
import { TILE_SIZE, LEVEL_WIDTH, LEVEL_HEIGHT } from "../app";
import { Player } from "./Player";
import { Level } from "./Level";

const MAX_BREAK_TIME_MS = 4000;

export class Coin {
  public position: Point;
  private sprite: Sprite;
  private isMoving: boolean;
  private endOfBreakTime = 0;

  constructor(private id, private player: Player, private coins: Coin[]) {
    this.position = new Point(
      Math.ceil(Math.random() * LEVEL_WIDTH),
      Math.ceil(Math.random() * LEVEL_HEIGHT)
    );
    this.isMoving = false;
  }

  create(game: Phaser.Game, group: Phaser.Group) {
    this.sprite = game.add.sprite(
      this.position.x * TILE_SIZE,
      this.position.y * TILE_SIZE,
      "chips"
    );
    group.add(this.sprite);
  }

  update(game: Phaser.Game, level: Level) {
    if (this.sprite.alive === false) {
      return;
    }

    const playerPosition = this.player.getPosition();

    // on player collision
    if (playerPosition.equals(this.position)) {
      this.sprite.kill();
      return;
    }

    if (this.isMoving || this.endOfBreakTime > game.time.time) {
      return;
    }

    const direction = Math.ceil(Math.random() * 4);
    if (direction === 1) {
      this.moveTo(game, level, this.position.left());
    } else if (direction === 2) {
      this.moveTo(game, level, this.position.right());
    } else if (direction === 3) {
      this.moveTo(game, level, this.position.up());
    } else if (direction === 4) {
      this.moveTo(game, level, this.position.down());
    }
  }

  private moveTo(game: Phaser.Game, level: Level, position: Point) {
    if (!this.isMovingAllowed(level, position)) {
      return;
    }

    this.isMoving = true;
    this.position = position;

    game.add.tween(this.sprite).to(
      {
        x: this.position.x * TILE_SIZE,
        y: this.position.y * TILE_SIZE
      },
      0.6 * Phaser.Timer.SECOND,
      Phaser.Easing.Default,
      true
    );

    game.time.events.add(
      0.6 * Phaser.Timer.SECOND,
      () => {
        this.isMoving = false;
        this.endOfBreakTime =
          game.time.time + Math.random() * MAX_BREAK_TIME_MS;
        this.sprite.position.x = this.position.x * TILE_SIZE;
        this.sprite.position.y = this.position.y * TILE_SIZE;
      },
      this
    );
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

    if (!level.isAllowedForCoin(position)) {
      return false;
    }

    for (const coin of this.coins) {
      if (coin.id === this.id) {
        continue;
      }
      if (coin.position.equals(position)) {
        return false;
      }
    }

    return true;
  }
}
