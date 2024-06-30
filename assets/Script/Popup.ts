import { _decorator, Component, Node, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Popup')
export class Popup extends Component {
    // [1]
    // dummy = '';
    @property({type: Node, tooltip: 'Nội dung'})
    private content:Node= null;
    // [2]
    // @property
    // serializableDummy = 0;

    start () {
        this.content.scale = v3(0,0,0)
        tween(this.content)
        .to(0.2, {scale: v3(1,1,1)}, { easing: 'backOut' })
        .start()
        // [3]
    }
    public display(){
        this.content.scale = v3(0,0,0)
        tween(this.content)
        .to(0.2, {scale: v3(1,1,1)}, { easing: 'backOut' })
        .start()
    }
    public onBack(){
        // allCloseBtn
        tween(this.content)
        .to(0.2, {scale: v3(0,0,0)}, { easing: 'backOut' })
        .call(()=>{
            this.node.destroy()
        })
        .start()
    }
    public onActive(){
        // allCloseBtn
        tween(this.content)
        .to(0.2, {scale: v3(0,0,0)}, { easing: 'backOut' })
        .call(()=>{
            this.node.active = false
        })
        .start()
    }
    // update (deltaTime: number) {
    //     // [4]
    // }
}