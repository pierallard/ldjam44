import { Game, Group, BitmapText } from "phaser-ce";
import { Coin } from "./Coin";
import {PlayableCoin} from "./PlayableCoin";

export class CoinCounter {
  private text: BitmapText;
  private coins: Coin[];
  private playableCoin: PlayableCoin;

  constructor(coins: Coin[], playableCoin: PlayableCoin) {
    this.coins = coins;
    this.playableCoin = playableCoin;
  }

  create = (game: Game, group: Group) => {
    this.text = game.add.bitmapText(game.width - 60, 5, "Carrier Command", "", 7, group);
    this.text.fixedToCamera = true;
  };

  update = () => {
    let coinAliveCount = 0;
    for (const coin of this.coins) {
        if (coin.isAlive()) {
            coinAliveCount++;
        }
    }
    if (this.playableCoin.isAlive()) {
      coinAliveCount++;
    }
    this.text.setText(coinAliveCount + " coins");
    this.text.updateText();
  };
}
