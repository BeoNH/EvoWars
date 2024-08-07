import { _decorator, Component, Enum, EventTarget, EventTouch, Node, UIOpacity, UITransform, v3 } from 'cc';
const { ccclass, property } = _decorator;


/**
 * 全局事件监听实例
 */
export const instance = new EventTarget(); 

/**
 * 方向类型
 */
export enum DirectionType {
  FOUR,
  EIGHT,
  ALL,
}

/**
 * 速度类型
 */
export enum SpeedType {
  STOP,
  NORMAL,
  FAST,
}

/**
 * 摇杆类型
 */
export enum JoystickType {
  FIXED,
  FOLLOW,
}

/**
 * 摇杆类
 */
@ccclass('Joystick')
export class Joystick extends Component {

    @property({ type: Node, tooltip: "Dot"})
    public dot:Node = null;
    
    @property({ type: Node, tooltip: "Ring"})
    public ring:Node = null;
    

    @property({ type: Enum(JoystickType), tooltip: "Touch Type"})
    public joystickType = JoystickType.FIXED;
    
    
    @property({ type: Node, tooltip: "Vị trí của cần điều khiển"})
    _stickPos = null;
    
    @property({ type: Node, tooltip: "Vị trí chạm"})
    _touchLocation = null;
    
    @property({tooltip: "Vị trí chạm"})
      _radius = 0;
    
      onLoad() {
        this._radius = this.ring.getComponent(UITransform).width / 2;
        this._initTouchEvent();
        // hide joystick when follow
        this.node.getComponent(UIOpacity).opacity = this.joystickType === JoystickType.FIXED ? 255 : 0;
      }
    
      /**
       * 初始化触摸事件
       */
      _initTouchEvent() {
        // set the size of joystick node to control scale
        this.node.on(Node.EventType.TOUCH_START, this._touchStartEvent, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this._touchMoveEvent, this);
        this.node.on(Node.EventType.TOUCH_END, this._touchEndEvent, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this._touchEndEvent, this);
      }
    
      /**
       * 触摸开始回调函数
       * @param event
       */
      _touchStartEvent(event: EventTouch) {
        instance.emit(Node.EventType.TOUCH_START, event);
    
        let localMouse = event.getUILocation();
        const touchPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(v3(localMouse.x,localMouse.y));
    
        if (this.joystickType === JoystickType.FIXED) {
          this._stickPos = this.ring.getPosition();
    
          // 触摸点与圆圈中心的距离
          const distance = touchPos.subtract(this.ring.getPosition()).length();
    
          // 手指在圆圈内触摸,控杆跟随触摸点
          this._radius > distance && this.dot.setPosition(touchPos);
        } else if (this.joystickType === JoystickType.FOLLOW) {
          // 记录摇杆位置，给 touch move 使用
          this._stickPos = touchPos;
          this.node.getComponent(UIOpacity).opacity = 255;
          this._touchLocation = event.getUILocation();
    
          // 更改摇杆的位置
          this.ring.setPosition(touchPos);
          this.dot.setPosition(touchPos);
        }
      }
    
      /**
       * 触摸移动回调函数
       * @param event
       */
      _touchMoveEvent(event: EventTouch) {
        // 如果 touch start 位置和 touch move 相同，禁止移动
        if (
          this.joystickType === JoystickType.FOLLOW &&
          this._touchLocation === event.getUILocation()
        ) {
          return false;
        }
    
        // 以圆圈为锚点获取触摸坐标
        let localMouse = event.getUILocation();
        const touchPos = this.ring.getComponent(UITransform).convertToNodeSpaceAR(v3(localMouse.x,localMouse.y));
        const distance = touchPos.length();
    
        // 由于摇杆的 postion 是以父节点为锚点，所以定位要加上 touch start 时的位置
        const posX = this._stickPos.x + touchPos.x;
        const posY = this._stickPos.y + touchPos.y;
    
        // 归一化
        const p = v3(posX, posY).subtract(this.ring.getPosition()).normalize();
    
        let speedType;
    
        if (this._radius > distance) {
          this.dot.setPosition(v3(posX, posY));
          speedType = SpeedType.NORMAL;
        } else {
          // 控杆永远保持在圈内，并在圈内跟随触摸更新角度
          const x = this._stickPos.x + p.x * this._radius;
          const y = this._stickPos.y + p.y * this._radius;
          this.dot.setPosition(v3(x, y));
    
          speedType = SpeedType.FAST;
        }
    
        instance.emit(Node.EventType.TOUCH_MOVE, event, {
          speedType: speedType,
          moveDistance: p,
        });
      }
    
      /**
       * 触摸结束回调函数
       * @param event
       */
      _touchEndEvent(event: EventTouch) {
        this.dot.setPosition(this.ring.getPosition());
        if (this.joystickType === JoystickType.FOLLOW) {
          this.node.getComponent(UIOpacity).opacity = 0;
        }
    
        instance.emit(Node.EventType.TOUCH_END, event, {
          speedType: SpeedType.STOP,
        });
      }
}

