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
        },
        addEvent: function (element, event, listener) {
            if (element.addEventListener) { //标准
                element.addEventListener(event, listener, false);
            } else if (element.attachEvent) { //低版本ie
                element.attachEvent("on" + event, listener);
            } else { //都不行的情况
                element["on" + event] = listener;
            }
        },
        renderCmd:function(command,index,isCheck){//isCheck为false表示不检查，true表示进行检查
            var error=false;//每次渲染都新建这个变量，代表所有输入的指令是否合法，false表示所有指令都合法，反之表示有不合法的指令存在
            var arrData=command.value.split("\n");
            var str="";
            for(var i=0;i<arrData.length;i++){
                if(isCheck&&func.checkCmd(arrData[i])){//如果有不合法的指令则变为true
                    str+="<li class='error'>"+(i+1)+"</li>";
                    error=true;
                }else {
                    str+="<li>"+(i+1)+"</li>";
                }
            }
            index.innerHTML=str;
            /**
             * 返回一个对象，包含代表所有指令是否合法的布尔值和分割好的初始指令序列
             */
            return{
                haveError:error,
                commandArray:arrData
            };
        },
        checkCmd: function (data) {
            var regGO = /^GO(\s\d+)?$/;
            var regTUN = /^TUN\s(LEF|BAC|RIG)$/; //检测TUN指令
            var regTRAMOV = /^(TRA|MOV)\s(LEF|RIG|TOP|BOT)(\s\d+)?$/; //检测TRA指令跟MOV指令
            return !regGO.test(data) && !regTUN.test(data) && !regTRAMOV.test(data);//返回检测结果
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
Square.prototype.analyseCommand=function(value){
    switch (value){
        case "GO":
            setTimeout(square.go(),500);
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
var command=document.getElementById("command");//输入命令
var btn=document.getElementById("start");//执行按钮
var index=document.getElementById("index");//左侧代码编号框
btn.onclick=function(){
    var result=func.renderCmd(command,index,true);//渲染代码编号框
    if(!result.haveError){//如果所有指令都输入正确
        runCommand(getCommandNumber(result.commandArray));//开始执行指令
    }
    console.log(getCommandNumber(result.commandArray));
};
function getCommandNumber(originCommandArray) {
    var newCommandArray = [];
    for (var i in originCommandArray) {
        if (/\d/.test(originCommandArray[i])) {//如果数据包含数字
            var lastSpace = originCommandArray[i].lastIndexOf(" ");//找最后出现的空格
            for (var j = 0; j < parseInt(originCommandArray[i].substring(lastSpace + 1, originCommandArray[i].length)); j++) {
                newCommandArray.push(originCommandArray[i].substring(0, lastSpace));
            }
        } else {
            newCommandArray.push(originCommandArray[i]);
        }
    }
    return newCommandArray;
}
function runCommand(commandArray){
    var command=commandArray.shift();
    if (command){
        square.analyseCommand(command);
        setTimeout(function(){
            runCommand(commandArray);
        },1000);
    }
}
/**
 * 给输入区域添加输入事件，每次输入都动态刷新代码行编号框
 */
func.addEvent(command, "input", renderConsole);
func.addEvent(command, "propertychange", renderConsole);//兼容IE8及以下
function renderConsole() {
    func.renderCmd(command, index, false);
}
/**
 * 给输入区域添加滚动事件，让左侧的代码编号框也一起滚动
 */
func.addEvent(command, "scroll", checkScroll);
function checkScroll() {
    index.scrollTop = command.scrollTop;
}
var reset=document.getElementById("reset");
reset.onclick=function(){
    command.value="";
    index.innerHTML="<li>1</li>";
};