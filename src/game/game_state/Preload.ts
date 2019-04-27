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
    }

    private loadFonts() {
        this.game.load.bitmapFont('font', 'dist/assets/fonts/font.png', 'dist/assets/fonts/font.xml');
    }
}
