import Point from "./Point";
import Sprite = Phaser.Sprite;

export class Tile {
  private position: Point;
  private sprite: Sprite;

  constructor(position: Point) {
    this.position = position;
  }

  create(game: Phaser.Game) {
    this.sprite = game.add.sprite(this.position.x * 24, this.position.y * 24, 'basic_ground');
  }
}
