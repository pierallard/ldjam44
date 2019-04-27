import {Level} from "../Level";
import {Player} from "../Player";
import { Coin } from "../Coin";
import {LEVEL_HEIGHT, LEVEL_WIDTH, TILE_SIZE} from "../../app";
import {PlayableCoin} from "../PlayableCoin";
import {EvilPlayer} from "../EvilPlayer";
import Key = Phaser.Key;
import Point from "../Point";
import { CoinCounter } from "../CoinCounter";
import { js as EasyStar } from 'easystarjs';

export default class Play extends Phaser.State {
  private level: Level;
  private player: Player;
  private coins: Coin[] = [];
  private playableCoin: PlayableCoin;
  private evilPlayer: EvilPlayer;
  private isCoinMode: boolean = false;
  private normalGroup: Phaser.Group;
  private evilGroup: Phaser.Group;
  private coinCounter: CoinCounter;

  constructor() {
    super();
    this.level = new Level();
    this.player = new Player();

    for (let i = 0; i < 5; i++) {
      this.coins.push(new Coin(i, new Point(Math.ceil(Math.random() * 5), Math.ceil(Math.random() * 3)), this.player, this.coins));
    }

    this.playableCoin = new PlayableCoin();

    const pathfinder = new EasyStar();
    pathfinder.setAcceptableTiles([0]);
    pathfinder.setGrid(this.level.getGrid());

    this.evilPlayer = new EvilPlayer(pathfinder, this.playableCoin, this.player.getPosition());

    this.coinCounter = new CoinCounter(this.coins);
  }

  public create(game: Phaser.Game) {
    this.normalGroup = game.add.group(null, 'NORMAL');
    this.evilGroup = game.add.group(null, 'EVIL');
    game.add.existing(this.normalGroup);
    game.add.existing(this.evilGroup);

    this.level.create(game, this.normalGroup, this.evilGroup);
    this.player.create(game, this.normalGroup);
    this.coins.forEach(coin => {
      coin.create(game, this.normalGroup)
    });
    this.coinCounter.create(game, this.normalGroup);

    this.evilPlayer.create(game, this.evilGroup);
    this.playableCoin.create(game, this.evilGroup);

    game.world.setBounds(0, 0, LEVEL_WIDTH * TILE_SIZE, LEVEL_HEIGHT * TILE_SIZE);
    this.refreshGroups(game);



    /* Text example */
    /* game.add.bitmapText(100,100, 'font', 'Sample text', 7);*/

    /* Graphics example */
    /*
    const graphics = game.add.graphics(100, 150);
    graphics.lineStyle(2, 0xffff00);
    graphics.drawRect(0, 0, 50, 50); */

    /* Image example */
    //game.add.image(100, 250, 'chips', 0);

    /* Animated sprite example */
    /*const sprite = game.add.sprite(100, 300, 'chips', 1);
    sprite.animations.add('animationName', [1, 2, 3, 4], 4, true);
    sprite.animations.play('animationName'); */

    /* Tween example */
    //game.add.tween(sprite).to( { x: 500 }, 4000, Phaser.Easing.Default, true);
  }

  public update(game: Phaser.Game) {
    const spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    if (spaceKey.justDown) {
      this.isCoinMode = !this.isCoinMode;
      this.refreshGroups(game);
    }
    if (false === this.isCoinMode && true === this.areAllCoinsDead()) {
      this.isCoinMode = true;
      this.refreshGroups(game);
    }

    this.player.update(game, this.level);
    this.coins.forEach(coin => coin.update(game, this.level));
    this.coinCounter.update();
    if (this.isCoinMode) {
        this.evilPlayer.update(game, this.level);
        this.playableCoin.update(game, this.level);
    }
  }

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

  private areAllCoinsDead = () => {
    for (const coin of this.coins) {
      if (coin.isAlive()) {
        return false;
      }
    }
    return true;
  }
}
