import { _decorator, Animation, BoxCollider2D, CircleCollider2D, Collider2D, Component, Contact2DType, IPhysics2DContact, misc, Node, Sprite, Tween, tween, UIOpacity, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export enum BOT_Type {
    STOP,
    MOVE,
    RUN,
}

@ccclass('Bot')
export class Bot extends Component {

    @property({ type: Node, tooltip: "Move Speed" })
    tagetNode: Node = null;

    @property({ tooltip: "Bot Type" })
    _BOT: BOT_Type = BOT_Type.STOP;

    private _moveSpeed: number = 100;
    private canAttack: boolean = true;
    private currentTween: Tween<Node> = null;

    protected onLoad(): void {
        this._BOT = BOT_Type.MOVE;
    }

    start() {
        let collider = this.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onCollision, this);
    }

    private onCollision(self: Collider2D, other: Collider2D, event: IPhysics2DContact | null) {
        if (self.node !== other.node.parent.parent && other.node.parent.name == 'Wepon') {
            console.log(">>>>>BOT");
        }
    }

    update(dt: number) {
        if (this.tagetNode && this._BOT !== BOT_Type.STOP) {
            this.move(dt);
        }
    }

    move(dt) {
        let currentPos = this.node.position.clone();
        let targetPos = this.tagetNode.position.clone();

        let dir = new Vec3();
        Vec3.subtract(dir, targetPos, currentPos);
        this.node.angle = misc.radiansToDegrees(Math.atan2(dir.y, dir.x));

        let distance = dir.length();
        dir.normalize();

        let moveStep = this._moveSpeed * dt;

        if (distance < this.rangeAttack()) {
            this.attack();
            this._BOT = BOT_Type.STOP;
            this.scheduleOnce(() => {
                this.run();
                console.log(">>>>>>>>>")
            }, 0.3);
        } else {
            let moveDelta = Vec3.multiplyScalar(new Vec3(), dir, moveStep);
            let newPosition = Vec3.add(new Vec3(), currentPos, moveDelta);
            this.node.position = newPosition;
        }
    }

    run() {
        let x = this.randomPos(-1200, 1200);
        let y = this.randomPos(-700, 700);
        let targetPos = new Vec3(x, y);

        if (this.currentTween) {
            this.currentTween.stop();
        }

        let speed = this._moveSpeed
        this.currentTween = tween(this.node)
            .to(2, { position: targetPos })
            .call(() => {
                this._BOT = BOT_Type.MOVE;
                this.currentTween = null;
            })
            .start();
    }

    attack() {
        if (!this.canAttack) return;
        this.canAttack = false;

        const wepon = this.node.getChildByPath('Wepon');
        if (wepon) {
            const animation = wepon.getComponent(Animation);
            if (animation) {
                animation.play();
            }

            this.scheduleOnce(() => {
                const uiOpacity = wepon.getComponent(UIOpacity);
                if (uiOpacity) {
                    uiOpacity.opacity = 100;
                }
            }, 0.3);
        }

        const sprite = this.node.getChildByName('CoolDown').getComponent(Sprite);
        if (sprite) {
            sprite.fillRange = 1;

            tween(sprite)
                .to(3, { fillRange: 0 })
                .call(() => {
                    const uiOpacity = wepon?.getComponent(UIOpacity);
                    if (uiOpacity) {
                        uiOpacity.opacity = 255;
                    }
                    this.canAttack = true;
                })
                .start();
        }
    }

    rangeAttack() {
        const rangeBody = this.node.getComponent(CircleCollider2D).radius;
        const rangeWepon = this.node.getChildByPath('Wepon/Image').getComponent(BoxCollider2D).size.width;
        const rangeHit = rangeBody + rangeWepon;

        return rangeHit - rangeHit * 0.2;
    }

    randomPos(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
