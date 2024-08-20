import { _decorator, Animation, BoxCollider2D, CCInteger, CircleCollider2D, clamp, Collider2D, Component, Contact2DType, director, instantiate, IPhysics2DContact, misc, Node, Prefab, resources, Sprite, sys, tween, UIOpacity, Vec3 } from 'cc';
import { EventMgr } from './EventMgr';
import { Storage } from './Storage';
import { Player } from './Player';
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
    private randPos: Vec3 = Vec3.ZERO;

    private lastCollisionTime: number = 0;
    private collisionCooldown: number = 2;

    public isDeath = false;

    protected onLoad(): void {
        this.loadCharater(() => {
            sys.localStorage.setItem('player2', `${this.typeChar}`);
            let collider = this.node.getChildByName(`Charater${this.typeChar}`).getComponent(CircleCollider2D);
            if (collider) {
                // Listening to 'onCollisionStay' Events
                let bodyCollider = this.getComponent(CircleCollider2D);
                bodyCollider.radius = collider.radius;
                bodyCollider.offset = collider.offset.clone();
                bodyCollider.apply();
                bodyCollider.on(Contact2DType.BEGIN_CONTACT, this.onCollision, this);
            }
        });
    }

    private onCollision(self: Collider2D, other: Collider2D, event: IPhysics2DContact | null) {
        if (this.isDeath) return;
        const currentTime = Date.now() / 1000; // Lấy thời gian hiện tại (giây)
        if (self.node !== other.node.parent.parent.parent && other.node.parent.name == 'Wepon') {
            if (currentTime - this.lastCollisionTime >= this.collisionCooldown) {
                this.handleCollision(other.node.parent.parent.parent);
                this.lastCollisionTime = currentTime;
            }
        }
    }

    private handleCollision(other: Node) {
        
        const body = this.node.getChildByPath(`Charater${this.typeChar}/Body`)
        if (body) {
            body.active = false;
            this.isDeath = true;
        }

        const dead = this.node.getChildByName('DestroyAnim');
        if (dead && !other.getComponent(Player).isDeath) {
            dead.active = true;
            const animation = dead.getComponent(Animation);
            if (animation) {
                animation.play();
                animation.once(Animation.EventType.FINISHED, () => {
                    this.node.destroy();
                    director.pause();
                    let score = Storage.getData('score');
                    score[0] += 1;
                    Storage.setData(`score`, score);
                    Storage.setData(`winner`, `player`);
                    EventMgr.emit(EventMgr.eventType.GAME_OVER);
                }, this);
            }
        }
    }

    update(dt: number) {
        if (this.tagetNode && this.tagetNode.parent) {
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

    private move(dt) {
        let currentPos = this.node.position.clone();
        this.targetPos = this.tagetNode.position.clone()

        let dir = new Vec3();
        if (this.canAttack) {
            Vec3.subtract(dir, this.targetPos, currentPos);
        } else {
            Vec3.subtract(dir, this.randPos, currentPos);
        }

        let distance = dir.length();
        dir.normalize();

        let moveStep = this._moveSpeed * dt;
        let moveDelta = Vec3.multiplyScalar(new Vec3(), dir, moveStep);
        let newPosition = Vec3.add(new Vec3(), currentPos, moveDelta);
        this.node.position = newPosition;

        if (distance < this.rangeAttack()) {
            if (this.canAttack) {
                this.attack();
            }
            let x = clamp(this.node.position.x + this.randomPos(-900, 900), -1200, 1200);
            let y = clamp(this.node.position.y + this.randomPos(-500, 500), -700, 700);
            this.randPos = new Vec3(x, y)

        }
        this.node.angle = misc.radiansToDegrees(Math.atan2(dir.y, dir.x));
    }

    attack() {
        if (!this.canAttack || !this.node) return;
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

            // cooldown 3s sau mới chém
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
        const rangeBody = this.node.getChildByPath(`Charater${this.typeChar}`)?.getComponent(CircleCollider2D).radius;
        const rangeWepon = this.node.getChildByPath(`Charater${this.typeChar}/Wepon/Image`)?.getComponent(BoxCollider2D).size.width;
        const rangeHit = rangeBody + rangeWepon;

        return rangeHit - rangeHit * 0.3;
    }

    randomPos(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
