export default class Preload extends Phaser.State {
  public preload() {
    this.loadAudio();
    this.loadImages();
    this.loadFonts();
  }

  public create() {
    this.game.state.start('Stage1');
  }

  private loadAudio() {
  }

  private loadImages() {
    this.game.load.spritesheet('chips', 'dist/assets/images/chips.png', 12, 12);
    this.game.load.spritesheet('basic_ground', 'dist/assets/images/ground/basic.png', 24, 24);
    this.game.load.spritesheet('evil_ground', 'dist/assets/images/ground/evil_basic.png', 24, 24);
    this.game.load.image('bloc_box', 'dist/assets/images/ground/bloc.png');
    this.game.load.image('evil_bloc_box', 'dist/assets/images/ground/evil_bloc.png');
    this.game.load.image('bloc_stone', 'dist/assets/images/ground/bloc2.png');
    this.game.load.image('evil_bloc_stone', 'dist/assets/images/ground/evil_bloc2.png');
    this.game.load.spritesheet('normal_hero', 'dist/assets/images/gentil_hero_all.png', 60, 30);
    this.game.load.spritesheet('evil_hero', 'dist/assets/images/evil_hero_all.png', 60, 60);
    this.game.load.spritesheet('normal_coin', 'dist/assets/images/gentil_coin.png', 24, 24);
    this.game.load.spritesheet('coin', 'dist/assets/images/coin.png', 24, 24);
    this.game.load.spritesheet('evil_coin', 'dist/assets/images/evil_coin.png', 60, 60);
    this.game.load.image('shadow', 'dist/assets/images/shadow.png');
    this.game.load.audio('music', 'dist/assets/musics/main_theme_chill.mp3');
    this.game.load.audio('evil_music', 'dist/assets/musics/main_theme_rock.mp3');
  }

  private loadFonts() {
    this.game.load.bitmapFont('font', 'dist/assets/fonts/font.png', 'dist/assets/fonts/font.xml');
    this.game.load.bitmapFont('Carrier Command', 'dist/assets/fonts/carrier_command.png', 'dist/assets/fonts/carrier_command.xml');
  }
}
