import { _decorator, Camera, Canvas, Component, director, EPhysics2DDrawFlags, EventMouse, Node, PhysicsSystem2D, screen, sys, UITransform, v3, Vec2, Vec3, view } from 'cc';
import { Storage } from './Storage';
import { EventMgr } from './EventMgr';
import { Player } from './Player';
import { Move } from './Move';
import { SpeedType } from './Joystick';
const { ccclass, property } = _decorator;

@ccclass('Map')
export class Map extends Component {
    @property(Camera)
    camera: Camera = null;

    debugPhysics() {
        PhysicsSystem2D.instance.enable = true;
        PhysicsSystem2D.instance.gravity = new Vec2(0, 0);
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
            EPhysics2DDrawFlags.Pair |
            EPhysics2DDrawFlags.CenterOfMass |
            EPhysics2DDrawFlags.Joint |
            EPhysics2DDrawFlags.Shape;

    }

    onLoad() {
        // this.debugPhysics();
        if (!sys.isMobile) {
            this.node.on(Node.EventType.MOUSE_DOWN, this.onAttack, this)
            this.node.on(Node.EventType.MOUSE_MOVE, this.onMove, this)
            this.node.on(Node.EventType.MOUSE_UP, this.onUp, this)
        }
    }


    private onAttack(ev: EventMouse) {
        if (ev.getButton() == EventMouse.BUTTON_LEFT) {
            Player.Instance.attack(null);
        } else if (ev.getButton() == EventMouse.BUTTON_RIGHT) {
            Move.Instance._speedType = SpeedType.FAST;
        }
        // console.log('TEST', ev.getButton(), EventMouse.BUTTON_LEFT, EventMouse.BUTTON_RIGHT);
    }

    private onUp(ev: EventMouse) {
        if (ev.getButton() == EventMouse.BUTTON_RIGHT) {
            Move.Instance._speedType = SpeedType.NORMAL;
        }
    }

    private onMove(ev: EventMouse) {
        if(!Move.Instance.node || !Move.Instance.node.parent) return;
        
        let mouseWp = v3(ev.getUILocation().x, ev.getUILocation().y);
        // let pos = this.camera.convertToUINode(Move.Instance.node.worldPosition, this.node);
        // console.log(pos);
        let mouseMapPoint = Move.Instance.node.parent.getComponent(UITransform).convertToNodeSpaceAR(mouseWp);
        Move.Instance.targetPos = mouseMapPoint;
    }

}

