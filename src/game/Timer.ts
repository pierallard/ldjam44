import BitmapText = Phaser.BitmapText;

export class Timer {
  private textBlock: Phaser.Graphics;
  private text: BitmapText;
  private remainingTime: number;

  create(game: Phaser.Game, interfaceGroup: Phaser.Group) {
    this.textBlock = game.add.graphics(0, 0);
    this.textBlock.beginFill(0x000000, 0.5);
    this.textBlock.drawRect(
      game.width - 105,
      game.height - 15,
      game.width - 140,
      15
    );
    this.textBlock.fixedToCamera = true;
    this.textBlock.alpha = 0;
    interfaceGroup.add(this.textBlock);

    this.text = game.add.bitmapText(game.width - 100, game.height - 10, "Carrier Command", "", 5, interfaceGroup);
    this.text.fixedToCamera = true;
    this.text.align = 'center';

    game.time.events.loop(Phaser.Timer.SECOND, () => {
      if (this.remainingTime !== null) {
        this.remainingTime--;
      }
    }, this);
  }

  update() {
    this.textBlock.alpha = 1;

    if (this.remainingTime === null) {
      this.text.setText('');
    } else {
      let remainingSeconds = Math.ceil(Math.max(0, this.remainingTime));
      let timebar = '';
      for (let _i = 0; _i < remainingSeconds; _i++) {
        timebar += '|';
      }

      this.text.setText("Time: " + remainingSeconds + " seconds");
    }
  }

  setRemainingTime(remainingTime: number) {
    this.remainingTime = remainingTime;
  }

  isOver() {
    if (this.remainingTime === null) {
      return false;
    }
    return this.remainingTime <= 0;
  }

  shouldGotoHunderMode() {
    return this.remainingTime < 18 && this.remainingTime > 0.5;
  }
}
