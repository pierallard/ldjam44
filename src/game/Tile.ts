import Point from "./Point";
import Sprite = Phaser.Sprite;
import {TILE_SIZE} from "../app";

export class Tile {
  private position: Point;
  private sprite: Sprite;

  constructor(position: Point) {
    this.position = position;
  }

  create(game: Phaser.Game) {
    this.sprite = game.add.sprite(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, 'basic_ground');
  }
}
