import {Level} from "../Level";
import {Player} from "../Player";
import { Coin } from "../Coin";

export default class Play extends Phaser.State {
  private level: Level;
  private player: Player;
  private coins: Coin[] = [];

  constructor() {
    super();
    this.level = new Level();
    this.player = new Player();
    this.coins.push(new Coin());
  }


  public create(game: Phaser.Game) {
    this.level.create(game);
    this.player.create(game);
    this.coins.forEach(coin => {
      coin.create(game)
    })

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
    this.player.update(game);
    this.coins.forEach(coin => coin.update(game))
  }
}
