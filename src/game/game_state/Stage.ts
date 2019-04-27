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

export abstract class Stage extends Phaser.State {
  protected player: Player;
  protected coins: Coin[] = [];
  protected playableCoin: PlayableCoin;
  protected evilPlayer: EvilPlayer;
  protected isCoinMode: boolean = false;
  protected normalGroup: Phaser.Group;
  protected evilGroup: Phaser.Group;
  protected coinCounter: CoinCounter;
  protected evilCoins: Coin[] = [];

  constructor(private level: Level) {
    super();

    let coinPositions = [];
    let tries = 1000;
    while (coinPositions.length < 10 && tries > 0) {
      const position = new Point(
        Math.ceil(Math.random() * this.level.getWidth()),
        Math.ceil(Math.random() * this.level.getHeight())
      );
      if (this.level.isAllowedForCoin(position)) {
        coinPositions.push(position);
      }
      tries--;
    }

    this.playableCoin = new PlayableCoin(coinPositions[0]);

    const pathfinder = new EasyStar();
    pathfinder.setAcceptableTiles([0]);
    pathfinder.setGrid(this.level.getGrid());

    this.player = new Player();

    this.evilPlayer = new EvilPlayer(
      pathfinder,
      this.playableCoin,
      this.player.getPosition()
    );

    coinPositions.forEach((pos, i) => {
      this.coins.push(new Coin(i, pos, this.player, this.coins));
      if (i !== 0) {
        this.evilCoins.push(new Coin(i, pos, this.evilPlayer, this.evilCoins));
      }
    });

    this.player.setCoins(this.coins);
    this.evilPlayer.setCoins(this.evilCoins);

    this.coinCounter = new CoinCounter(this.coins);
  }

  abstract onStageEnd();

  public create(game: Phaser.Game) {
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
    if (this.areAllCoinsDead(this.evilCoins)) {
      this.onStageEnd();

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
