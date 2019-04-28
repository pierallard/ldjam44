import { Level2 } from "../../levels/Level2";
import { Stage } from "./Stage";

export default class Stage2 extends Stage {
  constructor() {
    super(new Level2());
  }

  onGameWin = () => this.game.add.text(0,0,'WIN');
}
