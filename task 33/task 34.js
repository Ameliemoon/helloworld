/**
 * 用于存储小方块对象，考虑到全局要用，所以使用一个全局变量存储
 * @type {null}
 */
var square = null;
/**
 * 定义常量
 */
var WIDTH = 42;
var HEIGHT = 42;
/**
 * 一些基础功能
 * @type {{craetTable, $, addEvent}}
 */
var func = (function () {
    /**
     * 返回模块
     */
    return {
        /**
         * 接收参数，创建地图
         */
        createMap: function (container, config) {
            var fragment = document.createDocumentFragment();
            for (var i = 0; i < config.x; i++) {
                for (var j = 0; j < config.y; j++) {
                    fragment.appendChild(func.createDiv({
                        x: config.x,
                        y: config.y,
                        i: i,
                        j: j
                    }));
                }
            }
            container.style.width = config.y * WIDTH + config.y - 1 + "px";
            container.appendChild(fragment);
            return func.mkAction(container, config);
        },
        createDiv: function (obj) {
            var oDiv = document.createElement("div");
            oDiv.className = "maze-block";
            /**
             * 如果是最后一行的单元格，没有下边框
             */
            if (obj.i === obj.x - 1) {
                oDiv.className += " bottom-maze-block";
            }
            /**
             * 如果是最后一列的单元格，没有右边框
             */
            if (obj.j === obj.y - 1) {
                oDiv.className += " right-maze-block";
            }
            return oDiv;
        },
        mkAction: function (container, obj) {
            var ox = Math.floor(Math.random() * obj.x );
            var oy = Math.floor(Math.random() * obj.y );
            var action = func.createAction(ox, oy);
            container.appendChild(action);
            return new Square(ox, oy, 0, 0, action);
        },
        createAction: function (ox, oy) {
            var oAction = document.createElement('div');
            oAction.className = "Action";
            oAction.style.position = "absolute";
            oAction.style.left = oy * (WIDTH +1 ) + 'px';
            oAction.style.top = ox * (HEIGHT +1) + 'px';
            return oAction;
        }
    }
})();
/**
 * 生成地图和小方块对象
 * @type {*|Element|HTMLElement}
 */
var container = document.getElementById("container");
square = func.createMap(container, {
    x: 10,
    y: 10
});
function Square(x,y,deg,direction,domsquare){//x=纵坐标,y=横坐标,deg=角度,direction=方向,domsquare=目标方块
    this.x=x;
    this.y=y;
    this.deg=deg;
    this.direction=direction;//0-top 1-right 2-bottom 3-left
    this.domsquare=domsquare;
}
Square.prototype.go=function(){//前进函数
    if (this.direction==0){
        this.x>0&&this.x--;
    }else if(this.direction==1){
        this.y<9&&this.y++;
    }else if (this.direction==2){
        this.x<9&&this.x++;
    }else if(this.direction==3){
        this.y>0&&this.y--;
    }
    this.domsquare.style.left = this.y * (WIDTH +1) + "px";
    this.domsquare.style.top = this.x * (HEIGHT+1) + "px";
};
Square.prototype.changeDirection=function(value){//左右旋转和反向旋转
    if (value=="right"){
        if(this.direction==3){
            this.direction=0;
        }else {
            this.direction++;
        }
        this.deg+=90;
        this.domsquare.style.transform="rotate("+this.deg+"deg)";
    }else if(value=="left"){
        if (this.direction==0){
            this.direction=3;
        }else {
            this.direction--;
        }
        this.deg-=90;
        this.domsquare.style.transform="rotate("+this.deg+"deg)";
    }else if(value=="back"){
        if(this.direction==0){
            this.direction=2;
        }else if(this.direction==1){
            this.direction=3;
        }else {
            this.direction-=2;
        }
        this.deg+=180;
        this.domsquare.style.transform="rotate("+this.deg+"deg)";
    }
};
Square.prototype.translationSquare=function(value){//平移函数
    if (value=="left"){
        this.y>0&&this.y--;
    }else if(value=="top"){
        this.x>0&&this.x--;
    }else if(value=="right"){
        this.y<9&&this.y++;
    }else if(value=="bottom"){
        this.x<9&&this.x++;
    }
};
Square.prototype.changeTranslation=function(value){//先旋转再平移
    if(value=="left"){
        if(this.direction==0){
            this.changeDirection("left");
        }else if(this.direction==1){
            this.changeDirection("back");
        }else if(this.direction==2){
            this.changeDirection("right");
        }
    }else if(value=="top"){
        if(this.direction==1){
            this.changeDirection("left");
        }else if(this.direction==2){
            this.changeDirection("back");
        }else if(this.direction==3){
            this.changeDirection("right");
        }
    }else if(value=="right"){
        if(this.direction==0){
            this.changeDirection("right");
        }else if(this.direction==2){
            this.changeDirection("left");
        }else if(this.direction==3){
            this.changeDirection("back");
        }
    }else if(value=="bottom"){
        if(this.direction==0){
            this.changeDirection("back");
        }else if(this.direction==1){
            this.changeDirection("right");
        }else if(this.direction==3){
            this.changeDirection("left");
        }
    }
    this.go();
};
var command=document.getElementById("command");//输入命令
var btn=document.getElementById("start");//执行按钮
btn.onclick=function(){
    switch(command.value.trim()){
        case "GO":
            square.go();
            break;
        case "TUN LEF":
            square.changeDirection("left");
            break;
        case "TUN RIG":
            square.changeDirection("right");
            break;
        case "TUN BAC":
            square.changeDirection("back");
            break;
        case "TRA LEF":
            square.translationSquare("left");
            break;
        case "TRA TOP":
            square.translationSquare("top");
            break;
        case "TRA RIG":
            square.translationSquare("right");
            break;
        case "TRA BOT":
            square.translationSquare("bottom");
            break;
        case "MOV LEF":
            square.changeTranslation("left");
            break;
        case "MOV TOP":
            square.changeTranslation("top");
            break;
        case "MOV RIG":
            square.changeTranslation("right");
            break;
        case "MOV BOT":
            square.changeTranslation("bottom");
            break;
    }
};



