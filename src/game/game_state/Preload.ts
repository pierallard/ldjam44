export default class Preload extends Phaser.State {
    public preload () {
        this.loadAudio();
        this.loadImages();
        this.loadFonts();
    }

    public create () {
        this.game.state.start('Play');
    }

    private loadAudio() {
    }

    private loadImages() {
        this.game.load.spritesheet('chips', 'dist/assets/images/chips.png', 12, 12)
        this.game.load.image('basic_ground', 'dist/assets/images/ground/basic.png');
        this.game.load.image('evil_ground', 'dist/assets/images/ground/evil_basic.png');
        this.game.load.image('basic_bloc', 'dist/assets/images/ground/bloc.png');
        this.game.load.image('evil_bloc', 'dist/assets/images/ground/evil_bloc.png');
        this.game.load.spritesheet('normal_hero', 'dist/assets/images/gentil_hero_all.png', 30, 30);
    }

    private loadFonts() {
        this.game.load.bitmapFont('font', 'dist/assets/fonts/font.png', 'dist/assets/fonts/font.xml');
    }
}
