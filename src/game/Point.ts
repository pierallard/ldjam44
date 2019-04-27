import {DIRECTION} from "./Direction";

export default class Point extends PIXI.Point {
  equals(point: Point) {
    return this.x === point.x && this.y === point.y;
  }

  add(point: Point) {
    return new Point(this.x + point.x, this.y + point.y);
  }

  remove(point: Point) {
    return new Point(this.x - point.x, this.y - point.y);
  }

  left() {
    return this.add(new Point(-1, 0));
  }

  right() {
    return this.add(new Point(1, 0));
  }

  up() {
    return this.add(new Point(0, -1));
  }

  down() {
    return this.add(new Point(0, 1));
  }

  addDirection(direction: DIRECTION): Point {
    switch(direction) {
      case DIRECTION.LEFT: return this.left();
      case DIRECTION.RIGHT: return this.right();
      case DIRECTION.UP: return this.up();
      case DIRECTION.DOWN: return this.down();
    }

    throw "direction is null!"
  }

  addReverseSens(direction: DIRECTION) {
    switch(direction) {
      case DIRECTION.LEFT: return this.right();
      case DIRECTION.RIGHT: return this.left();
      case DIRECTION.UP: return this.down();
      case DIRECTION.DOWN: return this.up();
    }

    throw "direction is null!"
  }
}
