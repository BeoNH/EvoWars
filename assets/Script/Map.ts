import { _decorator, Component,  EPhysics2DDrawFlags, PhysicsSystem2D, Vec2 } from 'cc';
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
}

