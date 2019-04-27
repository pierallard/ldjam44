import Sprite = Phaser.Sprite;
import Point from "./Point";
import { TILE_SIZE, LEVEL_WIDTH, LEVEL_HEIGHT } from "../app";
import { Player } from "./Player";
import { Level } from "./Level";

export class Coin {
  private sprite: Sprite;
  private position: Point;
  private isMoving: boolean;

  constructor(private player: Player) {
    this.position = new Point(
      Math.ceil(Math.random() * LEVEL_WIDTH),
      Math.ceil(Math.random() * LEVEL_HEIGHT)
    );
    this.isMoving = false;
  }

  create(game: Phaser.Game) {
    this.sprite = game.add.sprite(
      this.position.x * TILE_SIZE,
      this.position.y * TILE_SIZE,
      "chips"
    );
  }

  update(game: Phaser.Game, level: Level) {
    if (this.sprite.alive === false) {
      return;
    }

    const playerPosition = this.player.getPosition();
    if (playerPosition.equals(this.position)) {
      this.sprite.kill();

      return;
    }

    if (this.isMoving) {
      return;
    }

    // const direction = playerPosition.remove(this.position).normalize()

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

    if (!level.isAllowedForPlayer(position)) {
      return false;
    }

    return true;
  }
}
