import BitmapText = Phaser.BitmapText;

export class Timer {
  private text: BitmapText;
  private remainingTime;

  create(game: Phaser.Game, interfaceGroup: Phaser.Group) {
    this.text = game.add.bitmapText(game.width - 100, 5, "Carrier Command", "", 7, interfaceGroup);
    this.text.fixedToCamera = true;

    game.time.events.loop(Phaser.Timer.SECOND, () => {
      this.remainingTime--;
    }, this);
  }

  update() {
    this.text.setText(this.remainingTime);
  }

  setRemainingTime(remainingTime: number) {
    this.remainingTime = remainingTime;
  }
}
