import Sprite = Phaser.Sprite;
import Point from "./Point";
import { TILE_SIZE} from "../app";
import {Level} from "../levels/Level";
import {Coin} from "./Coin";
import Game = Phaser.Game;
import {EvilPlayer} from "./EvilPlayer";
import {PlayableCoin} from "./PlayableCoin";

export class Player {
  private sprite: Sprite;
  private position : Point;
  private leftKey: Phaser.Key;
  private rightKey: Phaser.Key;
  private upKey: Phaser.Key;
  private downKey: Phaser.Key;
  private isMoving: boolean;
  private shadow: Sprite;
  private coins: Coin[];
  private evilPlayer: EvilPlayer;
  private playableCoin: PlayableCoin;

  constructor(position: Point) {
    this.position = position;
    this.isMoving = false;
  }

  getPosition() {
    return this.position;
  }

  create(game: Phaser.Game, group: Phaser.Group) {
    this.shadow = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, 'shadow');
    group.add(this.shadow);
    this.shadow.anchor.set(0.1, 0.1);
    this.sprite = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, 'normal_hero');
    group.add(this.sprite);

    this.sprite.animations.add('IDLE', [0, 1, 2, 3], Phaser.Timer.SECOND / 150, true);
    this.sprite.animations.add('RUN', [4, 5, 6, 7], Phaser.Timer.SECOND / 100, true);
    this.sprite.animations.add('KILL', [8, 9, 10, 11, 12], Phaser.Timer.SECOND / 100, false);
    this.sprite.animations.play('IDLE');
    this.sprite.anchor.set(0.1, 0.1);

    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  }

  followCamera(game: Phaser.Game) {
    game.camera.follow(this.sprite);
  }

  update(game: Phaser.Game, level: Level) {
    if (this.isMoving) {
      return;
    }

    const coin = this.canKill();

    if (coin) {
      this.kill(game, coin);
    } else if (this.leftKey.isDown) {
      this.moveTo(game, level, this.position.left());
    } else if (this.rightKey.isDown) {
      this.moveTo(game, level, this.position.right());
    } else if (this.upKey.isDown) {
      this.moveTo(game, level, this.position.up());
    } else if (this.downKey.isDown) {
      this.moveTo(game, level, this.position.down());
    } else {
      this.sprite.animations.play('IDLE');
      this.evilPlayer.playIdle();
    }
  }

  setPlayableCoin(playableCoin: PlayableCoin) {
    this.playableCoin = playableCoin;
  }

  private moveTo(game: Phaser.Game, level: Level, position: Point) {
    this.evilPlayer.moveTo(game, level, position, 0.3 * Phaser.Timer.SECOND);
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
    }, 0.3 * Phaser.Timer.SECOND, Phaser.Easing.Default, true);
    game.add.tween(this.shadow).to({
      x: position.x * TILE_SIZE,
      y: position.y * TILE_SIZE
    }, 0.3 * Phaser.Timer.SECOND, Phaser.Easing.Default, true);

    game.time.events.add(0.3 * Phaser.Timer.SECOND, () => {
      this.position = position;
      this.isMoving = false;
      this.sprite.position.x = this.position.x * TILE_SIZE;
      this.sprite.position.y = this.position.y * TILE_SIZE;
    }, this)
  }

  private isMovingAllowed(level: Level, position: Point) {
    if (!level.isAllowedForPlayer(position)) {
      return false;
    }

    return true;
  }

  setCoins(coins: Coin[]) {
    this.coins = coins;
  }

  private canKill(): Coin|PlayableCoin {
    const coins = this.coins.filter((coin) => {
      return coin.getPosition().equals(this.position) && coin.isAlive();
    });
    if (coins.length) {
      return coins[0];
    }
    if (this.playableCoin.getPosition().equals(this.position) && this.playableCoin.isAlive()) {
      return this.playableCoin;
    }
    return null;
  }

  private kill(game: Game, coin: Coin|PlayableCoin) {
    this.isMoving = true;
    this.sprite.animations.play('KILL');
    const duration = 0.5 * Phaser.Timer.SECOND;
    this.evilPlayer.runKillAnimation(game, duration);
    if (coin instanceof Coin) {
      coin.stopMoving();
    }
    game.time.events.add(duration, () => {
      this.sprite.animations.play('IDLE');
      this.isMoving = false;
      coin.kill();
    }, this)
  }

  setPosition(point: Point) {
    this.isMoving = false;
    this.position = point;
    this.sprite.position.x = this.position.x * TILE_SIZE;
    this.sprite.position.y = this.position.y * TILE_SIZE;
    this.shadow.position.x = this.position.x * TILE_SIZE;
    this.shadow.position.y = this.position.y * TILE_SIZE;
  }

  setEvilPlayer(evilPlayer: EvilPlayer) {
    this.evilPlayer = evilPlayer;
  }
}
