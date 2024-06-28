import { _decorator, CCInteger, Component, EPhysics2DDrawFlags, EventTouch, misc, Node, PhysicsSystem2D, RigidBody2D, v3, Vec2, Vec3 } from 'cc';
import { instance, SpeedType } from './Joystick';
const { ccclass, property } = _decorator;

@ccclass('Move')
export class Move extends Component {

    // from joystick
    @property({ type: Vec3, tooltip: "Move Dir" })
    moveDir = v3(Vec3.ZERO);

    @property({ tooltip: "Speed Type" })
    _speedType: SpeedType = SpeedType.STOP;

    // from self
    @property({ type: CCInteger, tooltip: "Move Speed" })
    _moveSpeed = 0;

    @property({ type: CCInteger, tooltip: "Stop Speed" })
    stopSpeed = 0;

    @property({ type: CCInteger, tooltip: "Normal Speed" })
    normalSpeed = 200;

    @property({ type: CCInteger, tooltip: "Normal Speed" })
    fastSpeed = 400;


    onLoad() {
        instance.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        instance.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        instance.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart() { }

    onTouchMove(event: EventTouch, data) {
        this._speedType = data.speedType;
        this.moveDir = data.moveDistance.clone();
    }

    onTouchEnd(event: EventTouch, data) {
        this._speedType = data.speedType;
    }

    /**
     * 移动
     */
    move() {
        this.node.angle = misc.radiansToDegrees(Math.atan2(this.moveDir.y, this.moveDir.x));
        const oldPos = this.node.position.clone();
        const newPos = oldPos.add(this.moveDir.clone().multiplyScalar(this._moveSpeed / 120));
        this.node.position = newPos;
        // this.getComponent(RigidBody2D).linearVelocity = new Vec2(this.moveDir.x * 3, this.moveDir.y * 3)
    }

    update(dt) {
        if (this.node) {
            switch (this._speedType) {
                case SpeedType.STOP:
                    this._moveSpeed = this.stopSpeed;
                    break;
                case SpeedType.NORMAL:
                    this._moveSpeed = this.normalSpeed;
                    break;
                case SpeedType.FAST:
                    this._moveSpeed = this.fastSpeed;
                    break;
                default:
                    break;
            }
            if (this._speedType !== SpeedType.STOP) {
                this.move();
            }
        }
    }
}

