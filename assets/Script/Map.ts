import { _decorator, Component, EventKeyboard, EventMouse, input, Input, KeyCode, misc, Node, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Map')
export class Map extends Component {

    @property({ type: Node, tooltip: 'người chơi' })
    private player: Node = null;
    @property({ type: Node, tooltip: 'Màn hình' })
    private camera: Node = null;
    
    start() {

    }

    update(dt: number) {
        if(this.camera){
            this.camera.worldPosition = this.player.worldPosition;
        }
    }
}

