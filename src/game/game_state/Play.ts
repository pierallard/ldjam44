import {Level} from "../Level";
import {Player} from "../Player";
import { Coin } from "../Coin";
import {LEVEL_HEIGHT, LEVEL_WIDTH, TILE_SIZE} from "../../app";
import {PlayableCoin} from "../PlayableCoin";
import {EvilPlayer} from "../EvilPlayer";
import Key = Phaser.Key;

export default class Play extends Phaser.State {
  private level: Level;
  private player: Player;
  private coins: Coin[] = [];
  private playableCoin: PlayableCoin;
  private evilPlayer: EvilPlayer;
  private isCoinMode: boolean = false;
  private normalGroup: Phaser.Group;
  private evilGroup: Phaser.Group;

  constructor() {
    super();
    this.level = new Level();
    this.player = new Player();

    for (let i = 0; i < 50; i++) {
      this.coins.push(new Coin(this.player));
    }
    this.playableCoin = new PlayableCoin();
    this.evilPlayer = new EvilPlayer(this.playableCoin, this.player.getPosition());
  }


  public create(game: Phaser.Game) {
    this.normalGroup = game.add.group(null, 'NORMAL');
    this.evilGroup = game.add.group(null, 'EVIL');
    game.add.existing(this.normalGroup);
    game.add.existing(this.evilGroup);

    this.level.create(game, this.normalGroup);
    this.player.create(game, this.normalGroup);
    this.coins.forEach(coin => {
      coin.create(game, this.normalGroup)
    });

    this.evilPlayer.create(game, this.evilGroup);
    this.playableCoin.create(game, this.evilGroup);

    game.world.setBounds(0, 0, LEVEL_WIDTH * TILE_SIZE, LEVEL_HEIGHT * TILE_SIZE);

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
      this.switchGroups();
    }

    this.player.update(game, this.level);
    this.coins.forEach(coin => coin.update(game, this.level));
    this.evilPlayer.update(game, this.level);
    this.playableCoin.update(game);
  }

  private switchGroups() {
    this.isCoinMode = !this.isCoinMode;
    if (this.isCoinMode) {
      this.normalGroup.alpha = 0;
      this.evilGroup.alpha = 1;
    } else {
      this.normalGroup.alpha = 1;
      this.evilGroup.alpha = 0;
    }
  }
}
