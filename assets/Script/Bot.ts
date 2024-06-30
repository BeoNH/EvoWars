import { _decorator, Animation, BoxCollider2D, CCInteger, CircleCollider2D, Collider2D, Component, Contact2DType, director, instantiate, IPhysics2DContact, misc, Node, Prefab, resources, Sprite, sys, Tween, tween, UIOpacity, Vec3 } from 'cc';
import { EventMgr } from './EventMgr';
const { ccclass, property } = _decorator;

export enum BOT_Type {
    STOP,
    MOVE,
    RUN,
}

@ccclass('Bot')
export class Bot extends Component {

    @property({ type: Node, tooltip: "Người chơi cần chạy đến" })
    tagetNode: Node = null;
    @property({ type: CCInteger, tooltip: "loại nhân vật" })
    public typeChar = 1;

    @property({ tooltip: "Bot Type" })
    _BOT: BOT_Type = BOT_Type.STOP;

    private _moveSpeed: number = 150;
    private canAttack: boolean = true;
    private targetPos: Vec3 = Vec3.ZERO;

    protected onLoad(): void {
        this.loadCharater(()=>{
            sys.localStorage.setItem('player2', `${this.typeChar}`);
            let collider = this.node.getChildByName(`Charater${this.typeChar}`).getComponent(Collider2D);
            if(collider){
                collider.on(Contact2DType.BEGIN_CONTACT, this.onCollision, this);
            }
        });
    }

    start() {
        this.scheduleOnce(()=>{
            this._BOT = BOT_Type.MOVE;
            this.targetPos = this.tagetNode.position.clone();
        },0.3)
    }

    private onCollision(self: Collider2D, other: Collider2D, event: IPhysics2DContact | null) {
        if (self.node.parent !== other.node.parent.parent.parent && other.node.parent.name == 'Wepon') {
            let body = this.node.getChildByPath(`Charater${this.typeChar}/Body`)
            body.active = false;

            let dead = this.node.getChildByName('DestroyAnim')
            dead.active = true;
            dead.getComponent(Animation).play();
            dead.getComponent(Animation).once(Animation.EventType.FINISHED, () => {
                this.node.destroy();
                EventMgr.emit(EventMgr.eventType.GAME_OVER)
                sys.localStorage.setItem(`winner`,`player`);
            }, this);
        }
    }

    update(dt: number) {
        if (this.tagetNode && this._BOT !== BOT_Type.STOP) {
            this.move(dt);
        }
    }

    private loadCharater(cb: Function) {
        resources.load<Prefab>(`prefabs/Charater/Charater${this.typeChar}`, (err, pref) => {
            // Instantiate and add to parent
            const uiView: Node = instantiate(pref);
            this.node.addChild(uiView);
            cb();
        });
    }

    move(dt) {
        let currentPos = this.node.position.clone();

        //xoay theo
        let dir = new Vec3();
        Vec3.subtract(dir, this.targetPos, currentPos);
        this.node.angle = misc.radiansToDegrees(Math.atan2(dir.y, dir.x));

        //di chuyển
        let distance = dir.length();
        dir.normalize();

        let moveStep = this._moveSpeed * dt;

        switch (this._BOT) {
            case BOT_Type.MOVE:

                if (distance < this.rangeAttack()) {
                    this.attack();
                    this._BOT = BOT_Type.STOP;
                    this.scheduleOnce(() => {
                        let x = this.randomPos(-1200, 1200);
                        let y = this.randomPos(-700, 700);
                        this.targetPos = new Vec3(x, y)
                        this._BOT = BOT_Type.RUN;
                    }, 0.4);
                } else {
                    let moveDelta = Vec3.multiplyScalar(new Vec3(), dir, moveStep);
                    let newPosition = Vec3.add(new Vec3(), currentPos, moveDelta);
                    this.node.position = newPosition;
                }
                break;

            case BOT_Type.RUN:
                if (distance < moveStep) {
                    this._BOT = BOT_Type.MOVE;
                    this.targetPos = this.tagetNode.position.clone();

                } else {
                    let moveDelta = Vec3.multiplyScalar(new Vec3(), dir, moveStep);
                    let newPosition = Vec3.add(new Vec3(), currentPos, moveDelta);
                    this.node.position = newPosition;
                }
                break;
        }
    }

    attack() {
        if (!this.canAttack) return;
        if(!this.node) return; 
        this.canAttack = false;

        const wepon = this.node.getChildByPath(`Charater${this.typeChar}/Wepon`);

        if (wepon) {
            wepon.getChildByName("Image").getComponent(BoxCollider2D).enabled = true;
            const animation = wepon.getComponent(Animation);
            if (animation) {
                animation.play();
                animation.once(Animation.EventType.FINISHED, () => {
                    wepon.getChildByName("Image").getComponent(BoxCollider2D).enabled = false;
                }, this);
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

        const rangeBody = this.node.getChildByPath(`Charater${this.typeChar}`).getComponent(CircleCollider2D).radius;
        const rangeWepon = this.node.getChildByPath(`Charater${this.typeChar}/Wepon/Image`).getComponent(BoxCollider2D).size.width;
        const rangeHit = rangeBody + rangeWepon;

        return rangeHit - rangeHit * 0.2;
    }

    randomPos(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
