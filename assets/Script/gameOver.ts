import { _decorator, Component, director, instantiate, Node, Prefab, resources, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('gameOver')
export class gameOver extends Component {
    init(){
        let type1 = sys.localStorage.getItem('player1');
        let type2 = sys.localStorage.getItem('player2');

        resources.load<Prefab>(`prefabs/Avatar/Avatar${type1}`, (err, pref) => {
            const uiView: Node = instantiate(pref);
            this.node.getChildByPath(`content/P1`).addChild(uiView);
          });
      
          resources.load<Prefab>(`prefabs/Avatar/Avatar${type2}`, (err, pref) => {
            const uiView: Node = instantiate(pref);
            this.node.getChildByPath(`content/P2`).addChild(uiView);
          });

          switch (sys.localStorage.getItem(`winner`)) {
            case `player`:
                this.node.getChildByPath(`content/WIN`).active = true;
                break;
                case `bot`:
                    this.node.getChildByPath(`content/DEFEAT`).active = true;
                
                break;
          }
    }

    
  onPlay(e) {
    director.loadScene(`Menu`);
  }
}


