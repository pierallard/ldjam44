import State = Phaser.State;
import Game = Phaser.Game;

export class Credits extends State {
  create(game: Game) {
    game.add.image(100, 100, 'normal_hero', 0);
  }
}
