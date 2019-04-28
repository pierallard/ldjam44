import { js as EasyStar } from "easystarjs";
import { TILE_SIZE } from "../../app";
import {Level} from "../../levels/Level";
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
  protected interfaceGroup: Phaser.Group;
  protected coinCounter: CoinCounter;
  private isGlitching: boolean = false;
  private level: Level;

  constructor(level: Level) {
    super();
    this.level = level;

    const pathfinder = new EasyStar();
    pathfinder.setAcceptableTiles([0]);
    pathfinder.setGrid(this.level.getGrid());

    this.playableCoin = new PlayableCoin(this.level.getOriginalPlayableCoinPosition());
    this.evilPlayer = new EvilPlayer(pathfinder, this.playableCoin, this.level.getOriginalPlayerPosition());
    this.player = new Player(this.level.getOriginalPlayerPosition());
    this.player.setEvilPlayer(this.evilPlayer);
    this.coins = [];
    this.level.getCoinPositions().forEach((pos, i) => {
      this.coins.push(new Coin(i, pos, this.evilPlayer, this.coins));
    });
    this.player.setCoins(this.coins);
    this.evilPlayer.setCoins(this.coins);
    this.coinCounter = new CoinCounter(this.coins);
  }

  abstract onGameWin();
  abstract onGameOver();

  public create(game: Phaser.Game) {
    /** Create groups */
    this.evilGroup = game.add.group(null, "EVIL");
    this.normalGroup = game.add.group(null, "NORMAL");
    this.interfaceGroup = game.add.group(null, 'INTERFACE');
    game.add.existing(this.normalGroup);
    game.add.existing(this.evilGroup);
    game.add.existing(this.interfaceGroup);

    /** Create items */
    this.level.create(game, this.normalGroup, this.evilGroup);
    this.player.create(game, this.normalGroup);
    this.coins.forEach(coin => {
      coin.create(game, this.normalGroup, this.evilGroup);
    });
    this.coinCounter.create(game, this.interfaceGroup);
    this.evilPlayer.create(game, this.evilGroup);
    this.playableCoin.create(game, this.evilGroup);

    game.world.setBounds(0, 0, this.level.getWidth() * TILE_SIZE, this.level.getHeight() * TILE_SIZE);
    this.refreshGroups(game);

    /** Reset positions of all the items */
    this.player.setPosition(this.level.getOriginalPlayerPosition());
    this.evilPlayer.setPosition(this.level.getOriginalPlayerPosition());
    this.playableCoin.setPosition(this.level.getOriginalPlayableCoinPosition());
    this.coins.forEach((coin, i) => {
      coin.setPosition(this.level.getCoinPositions()[i]);
    });
  }

  public update(game: Phaser.Game) {
    if (Math.random() < 0.01 && !this.isGlitching) {
      this.glitch(game);
    }

    if (game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).justDown) {
      this.glitch(game, false);
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
      this.coins.forEach((coin) => {
        coin.ressussite();
      });
      this.isCoinMode = true;
      this.refreshGroups(game);
      this.evilPlayer.setPosition(new Point(0, 0));

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
    if (this.areAllCoinsDead(this.coins)) {
      this.onGameWin();
      return;
    }

    this.evilPlayer.update(game, this.level);
    this.playableCoin.update(game, this.level);
    this.coins.forEach(coin => coin.update(game, this.level));
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

  private glitch(game: Phaser.Game, unglichRandom: boolean = true) {
    this.isGlitching = !this.isGlitching;
    if (this.normalGroup.alpha === 0) {
      this.normalGroup.alpha = 1;
      this.evilGroup.alpha = 0;
    } else {
      this.normalGroup.alpha = 0;
      this.evilGroup.alpha = 1;
    }

    if (unglichRandom) {
      game.time.events.add(Math.random() * Phaser.Timer.SECOND / 10, () => {
        this.isGlitching = !this.isGlitching;
        if (this.isCoinMode) {
          this.normalGroup.alpha = 0;
          this.evilGroup.alpha = 1;
        } else {
          this.normalGroup.alpha = 1;
          this.evilGroup.alpha = 0;
        }
      }, this)
    }
  }
}
