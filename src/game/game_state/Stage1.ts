import { Level1 } from "../../levels/Level1";
import { Stage } from "./Stage";
import { Game, StateManager } from "phaser-ce";

export default class Stage1 extends Stage {
  constructor() {
    super(new Level1());
  }

  onStageEnd = () => this.game.state.start("Stage2");
}
