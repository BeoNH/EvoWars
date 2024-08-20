import { _decorator, Component, director, Node } from 'cc';
import { Storage } from './Storage';
const { ccclass, property } = _decorator;

@ccclass('Menu')
export class Menu extends Component {
  start() {
    Storage.start();
  }

  onPlay(e) {
    Storage.setData(`score`, [0, 0]);
    director.loadScene(`gamePlay`);
    director.resume();
  }
}


