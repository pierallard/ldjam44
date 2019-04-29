export class SoundManager {
  private static music: Phaser.Sound;
  private static evilMusic: Phaser.Sound;

  static create(game: Phaser.Game) {
    if (!this.music) {
      this.music = game.add.audio('music');
      this.music.loop = true;
      this.evilMusic = game.add.audio('evil_music');
      this.evilMusic.volume = 0;
      this.evilMusic.loop = true;
      this.music.play();
      this.evilMusic.play();
    }
  }

  static changeMusicVolume(number: number) {
    this.music.volume = number;
  }

  static changeEvilMusicVolume(number: number) {
    this.evilMusic.volume = number;
  }
}