import { _decorator, Camera, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property(Node)
    public target: Node = null;

    start() {
        // this.node.getComponent(Camera).camera
    }

    update(deltaTime: number) {
        const { target, node } = this;

        if (target && target.parent) {
            node.position = target.position.clone();
        }
    }
}

