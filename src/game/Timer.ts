import BitmapText = Phaser.BitmapText;

export class Timer {
  private text: BitmapText;
  private remainingTime: number;

  create(game: Phaser.Game, interfaceGroup: Phaser.Group) {
    this.text = game.add.bitmapText(game.width - 100, 5, "Carrier Command", "", 7, interfaceGroup);
    this.text.fixedToCamera = true;

    game.time.events.loop(Phaser.Timer.SECOND, () => {
      this.remainingTime--;
    }, this);
  }

  update() {
    this.text.setText(Math.max(0, this.remainingTime) + ' s');
  }

  setRemainingTime(remainingTime: number) {
    this.remainingTime = remainingTime;
  }

  isOver() {
    return this.remainingTime < 0;
  }
}
