import { _decorator, Component, Node, sys, warn } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Storage')
export class Storage extends Component {
    private static defaultData: any = {
        user_name: 'test',//
        winer: "bot",
        score: [0, 0],
        typeCharPlayer: 0,
        typeCharBOT: 1,
    }

    public static gameData: any = null

    private static userData: any = null

    public static start(): void {
        console.log("-->this.gameData: ", this.gameData)

        if (!this.gameData) {
            let gameData: any = sys.localStorage.getItem('gameInfo')
            if (gameData) {
                try {
                    // gameData = UtilsEncrypt.decryptAes(gameData, Request.encryptAes.valum, Request.encryptAes.iv)
                    this.gameData = JSON.parse(gameData)
                } catch (e) {
                    this.resetData()
                    sys.localStorage.removeItem('userInfo')
                }
            } else {
                this.gameData = JSON.parse(JSON.stringify(this.defaultData))
            }

            let userData: any = sys.localStorage.getItem('userInfo');
            if (userData) {
                this.userData = JSON.parse(userData)
            }
        }
    }

    // /**
    //  * 设置游戏数据
    //  * @param gameData 
    //  */
    // public static setGameData(gameData: any) {
    //     this.gameData = JSON.parse(gameData);
    //     this.saveGameInfo(this.gameData)
    // }
    // // 获取默认数据
    // public static getDefaultData() {
    //     return JSON.stringify(this.defaultData)
    // }
    /**
     * 获取数据
     * @param key 
     * @returns 
     */
    public static getData(key: string): any {
        let data: any = null
        if (this.gameData.hasOwnProperty(key)) {
            data = JSON.stringify(this.gameData[key])
        } else {
            data = JSON.stringify(this.defaultData[key])
        }

        // console.log("getData",key, data);
        return JSON.parse(data)
    }
    /**
     * 存储数据（异步存储到Storage）
     * @param key 
     * @param value 
     */
    public static setData(key: string, value: any): void {
        // console.log("setData", key, value);

        if (!this.gameData.hasOwnProperty(key) && !this.defaultData.hasOwnProperty(key)) {
            warn(`storage Không có cấu hình "${key}" Giá trị ban đầu Vui lòng định cấu hình càng sớm càng tốt để ngăn ngừa lỗi càng sớm càng tốt`)
        }

        this.gameData[key] = value

        this.saveGameInfo(this.gameData)
        console.log(">>> saveDataGame <<<", key, value);
    }
    // /**
    //  * 获取用户信息
    //  * @param key 
    //  * @returns 
    //  */
    // public static getUserInfo(key?: string): any {
    //     let data: any = null
    //     if (!key) {
    //         if (this.userData != null) {
    //             data = JSON.stringify(this.userData)
    //         }
    //     } else {
    //         if (this.userData != null && this.userData.hasOwnProperty(key)) {
    //             data = JSON.stringify(this.userData[key])
    //         }
    //     }
    //     return JSON.parse(data)
    // }
    /**
     * 设置用户信息
     * @param args 
     */
    public static setUserInfo(...args: any[]): void {
        if (args.length > 1) {
            this.userData[args[0]] = args[1];
        } else {
            this.userData = args[0];
        }
        sys.localStorage.setItem('userInfo', JSON.stringify(this.userData))
    }
    /**
     * 重置游戏数据
     */
    public static resetData(): void {
        this.gameData = JSON.parse(JSON.stringify(this.defaultData))
        this.saveGameInfo(this.gameData)
        console.log("reset------------------");
    }

    // 保存数据到本地
    public static saveGameInfo(data: any) {
        let saveData: string = JSON.stringify(data);
        sys.localStorage.setItem('gameInfo', saveData)
    }
}


