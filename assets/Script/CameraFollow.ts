import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property(Node)
    public target: Node = null;

    @property
    public ratio: number = 0.08;

    // start() {}

    update(deltaTime: number) {
        // const { target, node, ratio } = this;

        // if (target) {
        //     node.position = Vec3.lerp(
        //         node.position,
        //         node.position,
        //         target.position,
        //         ratio
        //     );
        // }
    }
}

