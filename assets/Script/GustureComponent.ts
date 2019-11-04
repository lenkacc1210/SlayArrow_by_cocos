import GustureUtil from "./Utils/GustureUtils";

const {ccclass, property} = cc._decorator;


@ccclass
export default class GustureComponent extends cc.Component {

    @property(cc.Label)
    resultTxt: cc.Label = null;

    private _gls: cc.Graphics;
    private _last: cc.Vec2;

    private _GustureUtils: GustureUtil = GustureUtil.Instance;
    
    start() {
        this._gls = this.node.getChildByName("draw").getComponent(cc.Graphics);
    }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.ontouchStart, this);
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.ontouchStart, this);
    }          

    private ontouchStart(e: cc.Event.EventTouch): void {
        this._gls.clear();

        this.draw(e.getLocationX(), e.getLocationY());
        let checkpPos: cc.Vec2 = e.getLocationInView();
        this._GustureUtils.addPoint(checkpPos.x, checkpPos.y);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.ontouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.ontouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.ontouchEnd, this);
    }

    private ontouchEnd(e: cc.Event.EventTouch): void {
        this._gls.close();
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.ontouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.ontouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.ontouchEnd, this);

        let a = this._GustureUtils.checkGusture(false);
        this._GustureUtils.removeAllPoints(); 
        this.resultTxt.string = `gusture is ${a.Name},${a.Score.toFixed(2)}(score) ,${a.Time}(coust)`;
        if (a.Score > 0.85) {
            // 识别有效
            window.alert(a.Name);
        }
    }

    private ontouchMove(e: cc.Event.EventTouch): void {
        this.draw(e.getLocationX(), e.getLocationY(), this._last.x, this._last.y);

        let checkPos: cc.Vec2 = e.getLocationInView();
        this._GustureUtils.addPoint(checkPos.x, checkPos.y);
    }

    private draw(px: number, py: number, lastX: number = px, lastY: number = py): void {
        this._gls.moveTo(lastX, lastY);
        this._gls.lineTo(px, py);
        this._last = cc.v2(px, py);
        this._gls.stroke();
        this._gls.fill();
    }

}
