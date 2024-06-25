import { _decorator, Component, EPhysics2DDrawFlags, Node, PhysicsSystem2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TEst')
export class TEst extends Component {

    @property(Node)
    node2: Node = null;

    protected onLoad(): void {

        PhysicsSystem2D.instance.enable = true;
        PhysicsSystem2D.instance.gravity = new Vec2(0, 0);
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
            EPhysics2DDrawFlags.Pair |
            EPhysics2DDrawFlags.CenterOfMass |
            EPhysics2DDrawFlags.Joint |
            EPhysics2DDrawFlags.Shape;
    }

    start() {

    }

    update(deltaTime: number) {
        let pos = this.node2.position.clone();
        pos.x += 3;
        this.node2.position = pos;
    }
}

