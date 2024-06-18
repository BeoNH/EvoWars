import { _decorator, Animation, Button, CircleCollider2D, Collider, Collider2D, Component, Contact2DType, EventKeyboard, EventTouch, ICollisionEvent, Input, input, IPhysics2DContact, KeyCode, Sprite, tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    private coolDown: number = 1; //thoi gian hoi chieu
    private canAttack: boolean = true;


    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }


    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    start () {
        let collider = this.getComponentInChildren(Collider2D);
        // Listening to 'onCollisionStay' Events
        collider.on(Contact2DType.BEGIN_CONTACT, this.onCollision, this);
    }
    
    private onCollision (self: Collider2D, other: Collider2D ,event: IPhysics2DContact | null) {
        console.log(">>>>>",self,other,event);
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

