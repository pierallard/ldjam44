import Sprite = Phaser.Sprite;
import Point from "./Point";
import { TILE_SIZE, LEVEL_WIDTH, LEVEL_HEIGHT } from "../app";
import { Player } from "./Player";

export class Coin {
  private sprite: Sprite;
  private position: Point;
  private isMoving: boolean;

  constructor(private player: Player) {
    this.position = new Point(0, 0);
    this.isMoving = false;
  }

  create(game: Phaser.Game) {
    this.sprite = game.add.sprite(
      this.position.x * TILE_SIZE,
      this.position.y * TILE_SIZE,
      "chips"
    );
  }

  update(game: Phaser.Game) {
    if (this.isMoving) {
      return;
    }

    const direction = Math.ceil(Math.random() * 4);

    switch (direction) {
      case 1:
        this.moveTo(game, this.position.left());
        break;
      case 2:
        this.moveTo(game, this.position.right());
        break;
      case 3:
        this.moveTo(game, this.position.up());
        break;
      case 4:
        this.moveTo(game, this.position.down());
        break;
    }
  }

  private moveTo(game: Phaser.Game, position: Point) {
    if (!this.isMovingAllowed(position)) {
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

  private isMovingAllowed(position: Point) {
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

    return true;
  }
}
