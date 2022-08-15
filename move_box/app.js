import {Point} from './point.js';
import {Dialog} from './dialog.js';
class App{
    constructor(){
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
        console.log("devicePixelRatio " + window.devicePixelRatio);
        // window.devicePixelRatio 현재 표시 장치의 물리적 픽셀과
        // CSS 픽셀의 비율을 반환 -> CSS
        
        this.mousePos = new Point(0,0);
        this.curItem = null;
        
        this.items= [];
        this.total = 10;
        for(let i = 0; i < this.total; i++){
            this.items[i] = new Dialog();
        }

        window.addEventListener('resize', this.resize.bind(this),false);
        this.resize();

        //bind() 함수는 새롭게 바인딩한 함수를 만드는 함수로,
        //바인딩한 함수는 원본 함수 객체를 감싸는 함수로써, 
        //바인딩한 함수를 호출하면 일반적으로 래핑된 함수가 호출 된다. 

        window.requestAnimationFrame(this.animate.bind(this));
        document.addEventListener('pointerdown', this.onDown.bind(this),false); 
        document.addEventListener('pointermove', this.onMove.bind(this),false); 
        document.addEventListener('pointerup', this.onUp.bind(this),false); 
    }

    resize(){
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);
        console.log("pixelRatio = " + this.pixelRatio);
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 3;
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = 'rgba(0,0,0,0.1)';
        this.ctx.lineWidth = 2;

        for(let i = 0; i < this.items.length;i++){
            this.items[i].resize(this.stageWidth,this.stageHeight);
        }
    }
    animate(){
        
        window.requestAnimationFrame(this.animate.bind(this));
        this.ctx.clearRect(0 ,0 ,this.stageWidth, this.stageHeight);
        for(let i = 0 ; i < this.items.length;i++){
            this.items[i].animate(this.ctx);
        }
        if(this.curItem != null){
            console.log(`curItem is ${this.curItem.x} ${this.curItem.y}`);
            
            this.ctx.fillStyle = '#ff4338';
            this.ctx.strokeStyle = '#ff4338';

            this.ctx.beginPath();
            this.ctx.arc(this.mousePos.x,this.mousePos.y,8, 0,Math.PI * 2);
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.arc(this.curItem.centerPos.x,this.curItem.centerPos.y,8, 0,Math.PI * 2);
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.moveTo(this.mousePos.x, this.mousePos.y);
            this.ctx.lineTo(this.curItem.centerPos.x,this.curItem.centerPos.y);
            this.ctx.stroke();
        }


        
    }
    onDown(e){
       
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
        console.log("down x: " + this.mousePos.x + "y: "+ this.mousePos.y);
        for(let i = this.items.length - 1; i >= 0 ; i--){
            const item = this.items[i].down(this.mousePos.clone());
            if(item){
                this.curItem = item;
                console.log(`item is valid? ${item.pos.x}`);
                const index = this.items.indexOf(item);
                this.items.push(this.items.splice(index,1)[0]);
                break;
            }
        }
    }
    
    onMove(e){
       
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
        console.log(`mouse cor X: ${this.mousePos.x} Y: ${this.mousePos.y}`);
        for(let i = 0;i < this.items.length ;i++){
            this.items[i].move(this.mousePos.clone());
        }
    }
    onUp(e){
        this.curItem = null;

        for(let i = 0 ; i < this.items.length;i++){
            this.items[i].up();
        }

    }


}

window.onload = () =>{
    new App();
}