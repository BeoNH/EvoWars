import {
  _decorator,
  Component,
  director,
  instantiate,
  Label,
  Node,
  Prefab,
  resources,
} from "cc";
import { EventMgr } from "./EventMgr";
import { gameOver } from "./gameOver";
const { ccclass, property } = _decorator;

@ccclass("UIMgr")
export class UIMgr extends Component {
  @property({ type: Prefab, tooltip: "" })
  showGameOver: Prefab = null;
  @property({ type: Label, tooltip: "" })
  timeLabel: Label = null;

  private startTime: number = 0;

  onLoad() {
    console.log(">>>>>>>>>>>")
    EventMgr.once(EventMgr.eventType.GAME_OVER, this.gameOver, this);

    this.startTime = Date.now();
  }

  protected onDisable(): void {
    console.log("<<<<<<<<<<<")
    EventMgr.on(EventMgr.eventType.GAME_OVER, this.gameOver, this);
      
  }

  update(dt: number) {
    // Cập nhật Label
    this.timeLabel.string = this.getElapsedTime();
  }

  private gameOver() {
    resources.load<Prefab>(`prefabs/GameOver`, (err, pref) => {
        const uiView: Node = instantiate(pref);
      uiView.getComponent(gameOver).init();
      this.node.addChild(uiView);
      });

    //   const uiView: Node = instantiate(this.showGameOver);
    //   uiView.getComponent(gameOver).init();
    //   this.node.addChild(uiView);
  }

  getElapsedTime(): string {
    const elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    // Định dạng lại text mm:ss
    const formattedMinute = minutes < 10 ? "0" + minutes : String(minutes);
    const formattedSecond = seconds < 10 ? "0" + seconds : String(seconds);

    return `${formattedMinute}:${formattedSecond}`;
  }
}
