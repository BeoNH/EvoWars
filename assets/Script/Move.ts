import { _decorator, CCInteger, Component, director, Director, EPhysics2DDrawFlags, EventMouse, EventTouch, misc, Node, PhysicsSystem2D, RigidBody, RigidBody2D, sys, v3, Vec2, Vec3 } from 'cc';
import { instance, SpeedType } from './Joystick';
const { ccclass, property } = _decorator;

@ccclass('Move')
export class Move extends Component {
    private static _instance: Move;

    public static get Instance(): Move {
        return this._instance;
    }

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

    public targetPos: Vec3 = Vec3.ZERO;

    onLoad() {
        Move._instance = this
        if (sys.isMobile) {
            // instance.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
            instance.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            instance.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }
        this._speedType = SpeedType.NORMAL;
    }

    // onTouchStart() { }

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

        if (newPos.y > 950) newPos.y = 950;
        else if (newPos.y < -950) newPos.y = -950;
        if (newPos.x > 1469.855) newPos.x = 1469.855;
        else if (newPos.x < -1469.855) newPos.x = -1469.855;

        this.node.position = newPos;
    }

    moveAuto(dt) {
        if (!this.targetPos) return;

        let distance = this.targetPos.length();
        let dir = this.targetPos.clone().normalize();
        let moveDelta = dir.clone().multiplyScalar(this._moveSpeed * dt);
        this.node.position = this.node.position.clone().add(moveDelta);

        if (distance < 30) {
            this.targetPos = null;
            // this._speedType = SpeedType.STOP;
        }

        this.node.angle = misc.radiansToDegrees(Math.atan2(dir.y, dir.x));
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
                if (sys.isMobile) {
                    this.move();
                } else {
                    this.moveAuto(dt);
                }
            }
        }
    }
}

