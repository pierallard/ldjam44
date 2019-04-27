import { Game, Group, BitmapText } from "phaser-ce";
import { Coin } from "./Coin";

export class CoinCounter {
  private text: BitmapText;

  constructor(private coins: Coin[]) {}

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
    this.text.setText(coinAliveCount + " coins");
    this.text.updateText();
  };
}
