import { _decorator, Camera, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property(Node)
    public target: Node = null;

    @property
    public ratio: number = 0.08;

    start() {
        this.node.getComponent(Camera).camera
    }

    update(deltaTime: number) {
        const { target, node, ratio } = this;

        if (target) {
            node.position = Vec3.lerp(
                new Vec3(),
                node.position,
                target.position,
                ratio
            );
        }
    }
}

