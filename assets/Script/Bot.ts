import { _decorator, Animation, Component, misc, Node, Sprite, Tween, tween, UIOpacity, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bot')
export class Bot extends Component {

    // from self
    @property({ type: Node, tooltip: "Move Speed" })
    followNode: Node = null;

    private _moveSpeed: number = 100;
    private canAttack: boolean = true;

    move(dt) {
        let currentPos = this.node.position.clone();
        let targetPos = this.followNode.position.clone();

        //xoay theo
        let dir = new Vec3();
        Vec3.subtract(dir, targetPos, currentPos);
        this.node.angle = misc.radiansToDegrees(Math.atan2(dir.y, dir.x));

        // di chuyen
        let distance = dir.length();
        dir.normalize();

        let moveStep = this._moveSpeed * dt;

        if (distance < moveStep) {
            this.node.position = targetPos;
            this.attack();
        } else {
            let moveDelta = Vec3.multiplyScalar(new Vec3(), dir, moveStep);
            let newPosition = Vec3.add(new Vec3(), currentPos, moveDelta);
            this.node.position = newPosition;
        }
    }

    protected onLoad(): void {
        // this.move()
    }


    update(dt: number) {
        if (!this.followNode) return;
        this.move(dt)
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
                .to(1, { fillRange: 0 })
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
}

