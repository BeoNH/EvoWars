import { _decorator, Animation, AssetManager, assetManager, BoxCollider2D, Button, CCInteger, CircleCollider2D, Collider, Collider2D, Component, Contact2DType, director, EventKeyboard, EventTouch, ICollisionEvent, Input, input, instantiate, IPhysics2DContact, KeyCode, Node, Prefab, resources, Sprite, sys, tween, UIOpacity, warn } from 'cc';
import { EventMgr } from './EventMgr';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    @property({ type: CCInteger, tooltip: "loại nhân vật" })
    public typeChar = 1;

    private coolDown: number = 1; //thoi gian hoi chieu
    private canAttack: boolean = true;


    onLoad() {
        this.loadCharater(() => {
            sys.localStorage.setItem('player1', `${this.typeChar}`);
            let collider = this.node.getChildByName(`Charater${this.typeChar}`).getComponent(Collider2D);
            if (collider) {
                // Listening to 'onCollisionStay' Events
                collider.on(Contact2DType.BEGIN_CONTACT, this.onCollision, this);
            }
        });
    }


    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    private onCollision(self: Collider2D, other: Collider2D, event: IPhysics2DContact | null) {
        if (self.node.parent !== other.node.parent.parent.parent && other.node.parent.name == 'Wepon') {
            let body = this.node.getChildByPath(`Charater${this.typeChar}/Body`)
            body.active = false;

            let dead = this.node.getChildByName('DestroyAnim')
            dead.active = true;
            dead.getComponent(Animation).play();
            dead.getComponent(Animation).once(Animation.EventType.FINISHED, () => {
                this.node.active = false;
                EventMgr.emit(EventMgr.eventType.GAME_OVER)
                sys.localStorage.setItem(`winner`,`bot`);
            }, this);
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

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                console.log('Press a key');
                break;
        }
    }

    onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                this.attack(null);
                break;
        }
    }


    attack(e: EventTouch) {
        if (!this.canAttack) return;

        this.canAttack = false;

        let button = e.target.getComponent(Button);
        if (button) {
            button.enabled = false;
        }

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
                .to(this.coolDown, { fillRange: 0 })
                .call(() => {
                    const uiOpacity = wepon?.getComponent(UIOpacity);
                    if (uiOpacity) {
                        uiOpacity.opacity = 255;
                    }

                    if (button) {
                        button.enabled = true;
                    }

                    this.canAttack = true;
                })
                .start();
        } else {
            // Đảm bảo reset lại trạng thái nếu sprite không tồn tại
            if (button) {
                button.enabled = true;
            }
            this.canAttack = true;
        }
    }



}

