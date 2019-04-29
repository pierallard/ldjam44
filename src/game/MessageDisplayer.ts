import BitmapText = Phaser.BitmapText;
import Game = Phaser.Game;


export class MessageDisplayer {
  static WIDTH = 200;
  static HEIGHT = 50;
  static GAP = 10;

  private graphics: Phaser.Graphics;
  private text: BitmapText;
  private visible: boolean;

  create(game: Phaser.Game, interfaceGroup: Phaser.Group) {
    this.graphics = game.add.graphics(0, 0);
    interfaceGroup.add(this.graphics);
    this.graphics.beginFill(0x000000);
    this.graphics.drawRect(
      (game.width - MessageDisplayer.WIDTH) / 2,
      (game.height - MessageDisplayer.HEIGHT) / 2,
      MessageDisplayer.WIDTH,
      MessageDisplayer.HEIGHT
    );
    this.graphics.fixedToCamera = true;
    this.text = game.add.bitmapText(
      (game.width - MessageDisplayer.WIDTH) / 2 + MessageDisplayer.GAP,
      (game.height - MessageDisplayer.HEIGHT) / 2 + MessageDisplayer.GAP,
      "Carrier Command", "", 5, interfaceGroup);
    interfaceGroup.add(this.text);

    this.text.setText("default text");
    this.text.fixedToCamera = true;
    this.setVisible(false);
  }

  update(game: Phaser.Game) {
  }

  displayBig(game, text, duration) {
    this.display(game, text, duration);
  }

  display(game: Game, text: string, duration: number) {
    this.setVisible(true);
    this.text.setText(text);
    this.graphics.alpha = 1;
    game.time.events.add(duration, () => {
      this.setVisible(false);
    });
  }

  private setVisible(vis: boolean) {
    this.visible = vis;
    if (this.visible) {
      this.graphics.alpha = 1;
      this.text.alpha = 1;
    } else {
      this.graphics.alpha = 0;
      this.text.alpha = 0;
    }
  }

  isVisible() {
    return this.visible;
  }

  setText(youLost: string) {
    this.text.setText(youLost);
  }
}
