import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Menu')
export class Menu extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
    onPlay(e) {
        director.loadScene(`gamePlay`);
      }
}


