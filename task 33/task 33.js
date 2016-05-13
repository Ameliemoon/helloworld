//var bg=document.getElementById("background");
var func = (function () {
    return {
        /**
         * 接收参数，创建表格
         * @param tbody
         * @param row
         * @param col
         */
        craetTable: function (tbody, row, col) {
            var bg_tr = [];
            for(var i = 0; i < row; i++) {
                bg_tr[i] = document.createElement("tr");	// 创建11行tr
                tbody.appendChild(bg_tr[i]);
                var bg_td = [];
                for(var j = 0; j < col; j++) {
                    bg_td[j] = document.createElement("td");	// 创建11列td
                    if(i === 0 && j > 0) {
                        bg_td[j].innerHTML = j;	// 标注列数
                    }
                    if(i > 0 && j === 0) {
                        bg_td[j].innerHTML = i;	// 标注行数
                    }
                    bg_tr[i].appendChild(bg_td[j]);
                }
            }

        },
        /**
         * 获取元素
         * @param id
         * @returns {Element|HTMLElement}
         */
        $: function (id) {
            return document.getElementById(id);
        }

    }
})();
var bg = func.$("background");
func.craetTable(bg, 11, 11);

function Squaare(x,y,f){
    this.x=x;
    this.y=y;
    this.f=f;
    this.block=this.getBlock(this.x,this.y);
}//滑块构造器
Squaare.prototype.getBlock=function(x,y){
    return bg.rows[x].cells[y];
};//获取滑块的位置
Squaare.prototype.change=["Top","Right","Bottom","Left"];//
Squaare.prototype.reset=function(){
    this.block.className="";
    this.block.innerHTML="";
};//重置滑块状态
Squaare.prototype.setDiv=function(block){
    block.innerHTML="<div></div>";
};
Squaare.prototype.setDirction=function(block,D){
    block.className=D;
};//设置方向
Squaare.prototype.go=function(){
    switch (this.block.className){
        case "Top":
            if(this.x>1){
                this.x--;
                var newBlock=this.getBlock(this.x,this.y);
                this.setDiv(newBlock);
                this.setDirction(newBlock,this.change[this.f]);
                this.reset();
                this.block=newBlock;
            }
            break;
        case "Left":
            if(this.y>1){
                this.y--;
                var newBlock=this.getBlock(this.x,this.y);
                this.setDiv(newBlock);
                this.setDirction(newBlock,this.change[this.f]);
                this.reset();
                this.block=newBlock;
            }
            break;
        case "Right":
            if(this.y<10){
                this.y++;
                var newBlock=this.getBlock(this.x,this.y);
                this.setDiv(newBlock);
                this.setDirction(newBlock,this.change[this.f]);
                this.reset();
                this.block=newBlock;
            }
            break;
        case "Bottom":
            if(this.x<10){
                this.x++;
                var newBlock=this.getBlock(this.x,this.y);
                this.setDiv(newBlock);
                this.setDirction(newBlock,this.change[this.f]);
                this.reset();
                this.block=newBlock;
            }
            break;
    }
};//向前走的函数
Squaare.prototype.changeDirection=function(para){
    var result=this.f+para;
    if(result==4){
        this.f=0;
    }else if(result==-1){
        this.f=3;
    }else if(result==5){
        this.f=1;
    }else {
        this.f=result;
    }
    this.block.className=this.change[this.f];
};
var btn=document.getElementsByTagName("button");
var input=document.getElementById("input");
var square=new Squaare(6,5,0);
var div=document.createElement("div");
var cellId=square.getBlock(square.x,square.y);
cellId.className=square.change[square.f];
cellId.appendChild(div);
btn[0].onclick=function(){
    switch(input.value.trim()){
        case "GO":
            square.go();
            break;
        case "TUN LEF":
            square.changeDirection(-1);
            break;
        case "TUN RIG":
            square.changeDirection(1);
            break;
        case "TUN BAC":
            square.changeDirection(2);
            break;
    }
};
