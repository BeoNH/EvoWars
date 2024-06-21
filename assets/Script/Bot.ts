import { _decorator, Component, misc, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bot')
export class Bot extends Component {

    // from self
    @property({ type: Node, tooltip: "Move Speed" })
    followNode: Node = null;

    private _moveSpeed: number = 10;


    move() {
        let prev = this.node.position;
        let next = this.followNode.position;
        let dist = Vec3.distance(prev, next);
        
        this.node.angle = misc.radiansToDegrees(Math.atan2(next.y, next.x));

        let move = tween(this.node)
        move.to(dist * (0.1 / this._moveSpeed), { position: next })
        // move.call(()=>{
        //     console.log(">>>>attack")
        // })
        move.start();
    }

    update(dt) {
        if(this.followNode.position !== this.node.position){
            this.move();
        }
    }
}

