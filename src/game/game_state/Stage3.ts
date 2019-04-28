import { Level2 } from "../../levels/Level2";
import { Stage } from "./Stage";
import {Level3} from "../../levels/Level3";

export default class Stage3 extends Stage {
  constructor() {
    super(new Level3());
  }

  onGameWin = () => this.game.state.start("Credits");

  onGameOver() {
    this.game.state.restart(true);
  }
}
