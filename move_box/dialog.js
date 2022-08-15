import {Point} from './point.js';

const FOLLOW_SPEED = 0.08;
const ROTATE_SPEED = 0.12;
const MAX_ANGLE = 30;
const FPS = 1000/60;
const WIDTH = 200;
const HEIGHT = 200;

export class Dialog{
    constructor(){
        this.pos = new Point();
        this.target = new Point();
        // 가야할 위치
        this.prevPos = new Point();
        this.downPos = new Point();
        this.mousePos = new Point();
        //마우스가 클릭된 좌표 (상대좌표)
        this.centerPos = new Point();
        //마우스가 클릭된 좌표 (절대좌표)
        this.origin = new Point();
        this.rotation = 0;
        this.sideValue = 0;
        this.isdown = false;
        
    }
    resize(stageWidth, stageHeight){
        this.pos.x = Math.random() * (stageWidth - WIDTH);
        this.pos.y = Math.random() * (stageHeight - HEIGHT);
        this.target = this.pos.clone();
        this.prevPos = this.pos.clone();
    }

    animate(ctx){
        const move = this.target.clone().substract(this.pos).reduce(FOLLOW_SPEED)
        this.pos.add(move);
        this.centerPos = this.pos.clone().add(this.mousePos);
        this.swingDrag(ctx);

        this.prevPos = this.pos.clone();
    }
    swingDrag(ctx){
        const dx = this.pos.x - this.prevPos.x;
        const speedX = Math.abs(dx)/FPS;
        const speed = Math.min(Math.max(speedX,0),1);
        
        let rotation = (MAX_ANGLE / 1) * speed;
        rotation = rotation * (dx > 0 ? 1 : -1) - this.sideValue;

        this.rotation += (rotation - this.rotation) * ROTATE_SPEED;
        const tmpPos = this.pos.clone().add(this.origin);
        ctx.save();
        ctx.translate(tmpPos.x, tmpPos.y);
        ctx.rotate(this.rotation * Math.PI / 100);
        ctx.beginPath();
        ctx.fillStyle = '#f4e55a';
        ctx.fillRect(-this.origin.x, - this.origin.y, WIDTH, HEIGHT);
        ctx.restore();
    }
    down(point){
        console.log("item:" + this.pos.x + " " + this.pos.y );
        if(point.collide(this.pos,WIDTH,HEIGHT)){
            this.isDown = true;
            this.startPos = this.pos.clone();
            this.downPos = point.clone();
            this.mousePos = point.clone().substract(this.pos);
            console.log("clicked");
            console.log(`this ${this}`);

            const xRatioValue = this.mousePos.x / WIDTH;
            this.origin.x =  this.mousePos.x;
            this.origin.y =  this.mousePos.y;

            this.sideValue = xRatioValue - 0.5;
            return this;
        }
        else{
            return null;
        }
    }
    move(point){
        if(this.isDown){
            console.log("move");
            this.target = this.startPos.clone().add(point).substract(this.downPos);
        }
    }
    up(){
        console.log("up");
        this.isDown = false;
    }
}