import BitmapText = Phaser.BitmapText;

export class Timer {
  private text: BitmapText;
  private remainingTime: number;

  create(game: Phaser.Game, interfaceGroup: Phaser.Group) {
    this.text = game.add.bitmapText(game.width - 100, 5, "Carrier Command", "", 7, interfaceGroup);
    this.text.fixedToCamera = true;

    game.time.events.loop(Phaser.Timer.SECOND, () => {
      if (this.remainingTime !== null) {
        this.remainingTime--;
      }
    }, this);
  }

  update() {
    if (this.remainingTime === null) {
      this.text.setText('');
    } else {
      this.text.setText(Math.max(0, this.remainingTime) + ' s');
    }
  }

  setRemainingTime(remainingTime: number) {
    this.remainingTime = remainingTime;
  }

  isOver() {
    if (this.remainingTime === null) {
      return false;
    }
    return this.remainingTime < 0;
  }
}
