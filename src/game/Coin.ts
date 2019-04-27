import Sprite = Phaser.Sprite;
import Point from "./Point";
import { TILE_SIZE, LEVEL_WIDTH, LEVEL_HEIGHT } from "../app";
import { Player } from "./Player";
import { Level } from "./Level";

export class Coin {
  private sprite: Sprite;

  private isMoving = false;

  constructor(
    private id,
    private position: Point,
    private player: Player,
    private coins: Coin[]
  ) {}

  getPosition = () => this.position;

  isAlive = () => this.sprite.alive;

  create(game: Phaser.Game, group: Phaser.Group) {
    this.sprite = game.add.sprite(
      this.position.x * TILE_SIZE,
      this.position.y * TILE_SIZE,
      "normal_coin"
    );
    group.add(this.sprite);

    this.sprite.animations.add('IDLE', [0, 1, 2, 3, 4, 5], Phaser.Timer.SECOND / 70, true);
    this.sprite.animations.play('IDLE');
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

    if (Math.random() < 0.03 && Coin.dist(playerPosition, this.position) < 5) {
      const possiblePositions = [
        this.position, this.position.left(), this.position.right(), this.position.up(), this.position.down()
      ];
      const availablePositions = possiblePositions.filter((position) => {
        return this.isMovingAllowed(level, position);
      });

      if (availablePositions.length) {
        const sortedPositions = availablePositions.sort((a, b) => {
          return Coin.dist(playerPosition, b) - Coin.dist(playerPosition, a);
        });
        this.moveTo(game, level, sortedPositions[0]);
      }
    }
  }

  private moveTo(game: Phaser.Game, level: Level, position: Point) {
    if (!this.isMovingAllowed(level, position)) {
      return;
    }
    this.isMoving = true;
    if (this.position.x < position.x) {
      this.sprite.scale.set(1, 1);
      this.sprite.anchor.set(0, 0);
    } else if (this.position.x > position.x) {
      this.sprite.scale.set(-1, 1);
      this.sprite.anchor.set(1, 0);
    }
    game.add.tween(this.sprite).to({
      x: position.x * TILE_SIZE,
      y: position.y * TILE_SIZE
    }, 0.3 * Phaser.Timer.SECOND - Phaser.Timer.SECOND / 50, Phaser.Easing.Default, true);

    game.time.events.add(0.3 * Phaser.Timer.SECOND, () => {
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
}
