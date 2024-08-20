import {
  _decorator,
  Component,
  director,
  instantiate,
  Label,
  Node,
  Prefab,
  resources,
  sys,
} from "cc";
import { EventMgr } from "./EventMgr";
import { gameOver } from "./gameOver";
import { Storage } from "./Storage";
const { ccclass, property } = _decorator;

@ccclass("UIMgr")
export class UIMgr extends Component {
  @property({ type: Prefab, tooltip: "" })
  showGameOver: Prefab = null;
  @property({ type: Label, tooltip: "" })
  timeLabel: Label = null;
  @property({ type: Label, tooltip: "" })
  scoreLabel: Label[] = [];

  private startTime: number = 0;

  onLoad() {
    console.log(">>>>>")
    EventMgr.once(EventMgr.eventType.GAME_OVER, this.gameOver, this);

    this.startTime = Date.now();
  }

  protected onDisable(): void {
    EventMgr.off(EventMgr.eventType.GAME_OVER, this.gameOver, this);

  }

  protected start(): void {
    if (!sys.isMobile) {
      this.node.getChildByPath(`Joystick`).active = false;
      this.node.getChildByPath(`Attack_btn`).active = false;
    }
  }

  update(dt: number) {
    // Cập nhật Label
    this.timeLabel.string = this.getElapsedTime();
    let score = Storage.getData('score');
    this.scoreLabel[0].string = `${score[0]}`;
    this.scoreLabel[1].string = `${score[1]}`;
  }

  private gameOver() {
    let score = Storage.getData('score');
    if (score[0] >= 3 || score[1] >= 3) {
      resources.load<Prefab>(`prefabs/GameOver`, (err, pref) => {
        const uiView: Node = instantiate(pref);
        uiView.getComponent(gameOver).init(score);
        // console.log(">>>>>>>>tétadfa",this.node,uiView)
        this.node.addChild(uiView);
      });
    } else {
      director.loadScene(`gamePlay`);
      director.resume();
    }
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

  test() {
    director.loadScene(`gamePlay`);
  }
}
