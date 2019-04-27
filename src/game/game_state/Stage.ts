import { js as EasyStar } from "easystarjs";
import { TILE_SIZE } from "../../app";
import { Level } from "../../levels/Level";
import { Coin } from "../Coin";
import { CoinCounter } from "../CoinCounter";
import { EvilPlayer } from "../EvilPlayer";
import { PlayableCoin } from "../PlayableCoin";
import { Player } from "../Player";
import Point from "../Point";
import { Game } from "phaser-ce";
import {EvilCoin} from "../EvilCoin";

export abstract class Stage extends Phaser.State {
  protected player: Player;
  protected coins: Coin[] = [];
  protected playableCoin: PlayableCoin;
  protected evilPlayer: EvilPlayer;
  protected isCoinMode: boolean = false;
  protected normalGroup: Phaser.Group;
  protected evilGroup: Phaser.Group;
  protected coinCounter: CoinCounter;
  protected evilCoins: EvilCoin[] = [];
  private coinPositions: Point[];

  constructor(private level: Level) {
    super();

    this.coinPositions = [];
    let tries = 1000;
    while (this.coinPositions.length < 10 && tries > 0) {
      const position = new Point(
        Math.ceil(Math.random() * this.level.getWidth()),
        Math.ceil(Math.random() * this.level.getHeight())
      );
      if (this.level.isAllowedForCoin(position)) {
        this.coinPositions.push(position);
      }
      tries--;
    }

    this.playableCoin = new PlayableCoin(new Point(this.coinPositions[0].x, this.coinPositions[0].y));

    const pathfinder = new EasyStar();
    pathfinder.setAcceptableTiles([0]);
    pathfinder.setGrid(this.level.getGrid());

    this.player = new Player();

    this.evilPlayer = new EvilPlayer(
      pathfinder,
      this.playableCoin,
      this.player.getPosition()
    );

    this.coinPositions.forEach((pos, i) => {
      this.coins.push(new Coin(i, pos, this.player, this.coins));
      if (i !== 0) {
        this.evilCoins.push(new EvilCoin(i, pos, this.evilPlayer, this.evilCoins));
      }
    });

    this.player.setCoins(this.coins);
    this.evilPlayer.setCoins(this.evilCoins);

    this.coinCounter = new CoinCounter(this.coins);
  }

  protected onGameWin = () => {};
  protected onGameOver() {

  };

  public create(game: Phaser.Game) {
    this.player.setPosition(new Point(0, 0));
    this.evilPlayer.setPosition(new Point(0, 0));
    this.playableCoin.setPosition(this.coinPositions[0]);

    this.normalGroup = game.add.group(null, "NORMAL");
    this.evilGroup = game.add.group(null, "EVIL");
    game.add.existing(this.normalGroup);
    game.add.existing(this.evilGroup);

    this.level.create(game, this.normalGroup, this.evilGroup);
    this.player.create(game, this.normalGroup);
    this.coins.forEach(coin => {
      coin.create(game, this.normalGroup);
    });
    this.evilCoins.forEach(coin => {
      coin.create(game, this.evilGroup);
    });
    this.coinCounter.create(game, this.normalGroup);

    this.evilPlayer.create(game, this.evilGroup);
    this.playableCoin.create(game, this.evilGroup);

    game.world.setBounds(
      0,
      0,
      this.level.getWidth() * TILE_SIZE,
      this.level.getHeight() * TILE_SIZE
    );
    this.refreshGroups(game);
  }

  public update(game: Phaser.Game) {
    console.log(this.coinPositions[0]);
    const spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    if (spaceKey.justDown) {
      this.isCoinMode = !this.isCoinMode;
      this.refreshGroups(game);
    }

    if (this.isCoinMode) {
      this.updateEvilMode(game);
    } else {
      this.updateGoodMode(game);
    }

    this.coinCounter.update();
  }

  updateGoodMode = (game: Game) => {
    if (this.areAllCoinsDead(this.coins)) {
      this.isCoinMode = true;
      this.refreshGroups(game);

      return;
    }

    this.player.update(game, this.level);
    this.coins.forEach(coin => coin.update(game, this.level));
  };

  updateEvilMode = (game: Game) => {
    if (this.evilPlayer.getPosition().equals(this.playableCoin.position)) {
      this.onGameOver();
      return;
    }
    if (this.areAllCoinsDead(this.evilCoins)) {
      this.onGameWin();
      return;
    }

    this.evilPlayer.update(game, this.level);
    this.playableCoin.update(game, this.level);
    this.evilCoins.forEach(coin => coin.update(game, this.level));
  };

  private refreshGroups(game: Phaser.Game) {
    if (this.isCoinMode) {
      this.normalGroup.alpha = 0;
      this.evilGroup.alpha = 1;
      this.playableCoin.followCamera(game);
    } else {
      this.normalGroup.alpha = 1;
      this.evilGroup.alpha = 0;
      this.player.followCamera(game);
    }
  }

  private areAllCoinsDead = (coins: Coin[]) => {
    for (const coin of coins) {
      if (coin.isAlive()) {
        return false;
      }
    }
    return true;
  };
}
