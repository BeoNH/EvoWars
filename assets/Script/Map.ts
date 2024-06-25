import { _decorator, Component, EPhysics2DDrawFlags, EventKeyboard, EventMouse, input, Input, KeyCode, misc, Node, PhysicsSystem2D, tween, v3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Map')
export class Map extends Component {
    onLoad() {
        PhysicsSystem2D.instance.enable = true;
        PhysicsSystem2D.instance.gravity = new Vec2(0, 0);
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
            EPhysics2DDrawFlags.Pair |
            EPhysics2DDrawFlags.CenterOfMass |
            EPhysics2DDrawFlags.Joint |
            EPhysics2DDrawFlags.Shape;
    }

    update(dt: number) {
        // if (this.camera) {
        //     this.camera.position = this.player.position;
        // }
    }
}

