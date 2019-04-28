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
import {Timer} from "../Timer";
import {MessageDisplayer} from "../MessageDisplayer";


export abstract class Stage extends Phaser.State {
  static GLITCH_PROBA = 0.005;
  static GLITCH_SECONDS = 0.04;

  protected player: Player;
  protected coins: Coin[] = [];
  protected playableCoin: PlayableCoin;
  protected evilPlayer: EvilPlayer;
  protected isEvilMode: boolean = false;
  protected normalGroup: Phaser.Group;
  protected evilGroup: Phaser.Group;
  protected interfaceGroup: Phaser.Group;
  protected coinCounter: CoinCounter;
  private isGlitching: boolean = false;
  private level: Level;
  private timer: Timer;
  private messageDisplayer: MessageDisplayer;
  private music: Phaser.Sound;
  private evilMusic: Phaser.Sound;

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
    this.timer = new Timer();
    this.messageDisplayer = new MessageDisplayer();
    this.player.setPlayableCoin(this.playableCoin);
  }

  abstract onGameWin();
  abstract onGameOver();

  public create(game: Phaser.Game) {
    if (!this.music) {
        this.music = this.game.add.audio('music');
        this.evilMusic = this.game.add.audio('evil_music');
        this.evilMusic.volume = 0;
        this.music.play();
        this.evilMusic.play();
    }
    /** Create groups */
    this.evilGroup = game.add.group(null, "EVIL");
    this.normalGroup = game.add.group(null, "NORMAL");
    this.interfaceGroup = game.add.group(null, 'INTERFACE');
    game.add.existing(this.normalGroup);
    game.add.existing(this.evilGroup);
    game.add.existing(this.interfaceGroup);

    /** Create items */
    this.level.create(game, this.normalGroup, this.evilGroup);
    this.playableCoin.create(game, this.evilGroup, this.normalGroup);
    this.coins.forEach(coin => {
      coin.create(game, this.normalGroup, this.evilGroup);
    });
    this.coinCounter.create(game, this.interfaceGroup);
    this.evilPlayer.create(game, this.evilGroup);
    this.player.create(game, this.normalGroup);
    this.timer.create(game, this.interfaceGroup);

    game.world.setBounds(0, 0, this.level.getWidth() * TILE_SIZE, this.level.getHeight() * TILE_SIZE);
    this.refreshGroups(game);

    /** Reset positions of all the items */
    this.player.setPosition(this.level.getOriginalPlayerPosition());
    this.evilPlayer.setPosition(this.level.getOriginalPlayerPosition());
    this.playableCoin.setPosition(this.level.getOriginalPlayableCoinPosition());
    this.coins.forEach((coin, i) => {
      coin.reinitialize(this.level.getCoinPositions()[i]);
    });
    const durationMessage = 3 * Phaser.Timer.SECOND;
    this.timer.setRemainingTime(this.level.getRemainingTime() + durationMessage / Phaser.Timer.SECOND); // yeah, game jam
    this.messageDisplayer.create(game, this.interfaceGroup);
    this.messageDisplayer.display(game, "This is the create\nmessage", durationMessage);
  }

  public update(game: Phaser.Game) {
    this.messageDisplayer.update(game);
    if (this.messageDisplayer.isVisible()) {
      return;
    }

    if (Math.random() < Stage.GLITCH_PROBA && !this.isGlitching) {
      this.glitch(game);
    }

    if (game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).justDown) {
      this.glitch(game, false);
    }

    if (this.isEvilMode) {
      this.updateEvilMode(game);
    } else {
      this.updateGoodMode(game);
    }
    this.refreshGroups(game);

    this.coinCounter.update();
    this.timer.update();
  }

  updateGoodMode = (game: Game) => {
    if (this.areAllCoinsDead(this.coins)) {
      this.coins.forEach((coin) => {
        coin.ressussite();
      });
      this.playableCoin.ressussite();
      this.isEvilMode = true;
      this.timer.setRemainingTime(this.level.getRemainingTime());
      this.evilPlayer.setPosition(new Point(0, 0));

      return;
    }
    if (this.timer.isOver()) {
      this.game.state.restart(true);
      this.coins.forEach((coin) => {
        coin.ressussite();
      });
      this.playableCoin.ressussite();
    }

    this.player.update(game, this.level);
    this.coins.forEach(coin => coin.update(game, this.level));
  };

  updateEvilMode = (game: Game) => {
    if (this.evilPlayer.getPosition().equals(this.playableCoin.position)) {
      this.onGameOver();
      this.timer.setRemainingTime(this.level.getRemainingTime());
      return;
    }
    if (this.areAllCoinsDead(this.coins)) {
      this.onGameWin();
      this.timer.setRemainingTime(this.level.getRemainingTime());
      return;
    }

    this.evilPlayer.update(game, this.level);
    this.playableCoin.update(game, this.level);
    this.coins.forEach(coin => coin.update(game, this.level));
  };

  private refreshGroups(game: Phaser.Game) {
    if (this.isGlitching) {
      return;
    }
    if (this.isEvilMode) {
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

      this.music.volume = 1;
      this.evilMusic.volume = 0;
    } else {
      this.normalGroup.alpha = 0;
      this.evilGroup.alpha = 1;

      this.music.volume = 0;
      this.evilMusic.volume = 1;
    }

    if (unglichRandom) {
      game.time.events.add(Math.random() * Stage.GLITCH_SECONDS * Phaser.Timer.SECOND, () => {
        this.isGlitching = !this.isGlitching;
        if (this.isEvilMode) {
          this.normalGroup.alpha = 0;
          this.evilGroup.alpha = 1;

          this.music.volume = 0;
          this.evilMusic.volume = 1;
        } else {
          this.normalGroup.alpha = 1;
          this.evilGroup.alpha = 0;

          this.music.volume = 1;
          this.evilMusic.volume = 0;
        }
      }, this)
    }
  }
}
