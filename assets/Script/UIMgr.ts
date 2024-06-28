import { _decorator, Component, director, instantiate, Node, Prefab, resources } from 'cc';
import { EventMgr } from './EventMgr';
import { Player } from './Player';
import { Bot } from './Bot';
const { ccclass, property } = _decorator;

@ccclass('UIMgr')
export class UIMgr extends Component {

    @property({ type: Node, tooltip: "" })
    showGameOver: Node = null;

    onLoad() {
        EventMgr.on(EventMgr.eventType.GAME_OVER, this.gameOver, this);
    }

    private gameOver(type1 , type2) {;
        resources.load<Prefab>(`prefabs/Avatar/Avatar${type1}`, (err, pref) => {
            const uiView: Node = instantiate(pref);
            this.node.getChildByPath(`GameOver/P1`).addChild(uiView);
        });
        resources.load<Prefab>(`prefabs/Avatar/Avatar${type2}`, (err, pref) => {
            const uiView: Node = instantiate(pref);
            this.node.getChildByPath(`GameOver/P2`).addChild(uiView);
        });
        this.showGameOver.active = true;
    }
}


