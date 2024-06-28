
export class EventMgr {
    public static eventType: any = {
        GAME_OVER: 'gameOver',
    }

    private static _handlers: { [key: string]: any[] } = {};

    /**
     * 监听事件
     * @param eventName 
     * @param handler 
     * @param target 
     */
    public static on(eventName: string, handler: Function, target: any) {
        let objHandler: object = { handler: handler, target: target }

        let handlerList: Array<any> = this._handlers[eventName]
        if (!handlerList) {
            this._handlers[eventName] = handlerList = []
        }

        handlerList.push(objHandler)
    }

    /**
     * 监听一次事件之后就删除自己
     * @param eventName 
     * @param handler 
     * @param target 
     */
    public static once(eventName: string, handler: Function, target: any) {
        let objHandler: object = { handler: handler, target: target, type: 'once' }

        let handlerList: Array<any> = this._handlers[eventName]
        if (!handlerList) {
            this._handlers[eventName] = handlerList = []
        }

        handlerList.push(objHandler)
    }

    /**
     * 取消监听
     * @param eventName 
     * @param handler 
     * @param target 
     * @returns 
     */
    public static off(eventName: string, handler: Function, target: any) {
        let handlerList: Array<any> = this._handlers[eventName]
        if (!handlerList) return

        for (let i = 0; i < handlerList.length; i++) {
            let oldObj = handlerList[i]
            if (oldObj.handler == handler && oldObj.target == target) {
                handlerList.splice(i, 1)
                break;
            }
        }
    }

    /**
     * 发送事件
     * @param eventName 
     * @param values 
     * @returns 
     */
    public static emit(eventName: string, ...values: any) {
        let handlerList: Array<any> = this._handlers[eventName]
        if (!handlerList) return

        for (let v of handlerList) {
            if (v.handler) {
                v.handler.apply(v.target, values)
                if (v.type && v.type == 'once') {
                    this.off(eventName, v.handler, v.target);
                }
            }
        }
    }

    /**
     * 移除单个事件的所有监听
     * @param eventName 
     */
    public static offAll(eventName: string) {
        let handlerList: Array<any> = this._handlers[eventName]
        if (!handlerList) return

        this._handlers[eventName] = handlerList = []
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
