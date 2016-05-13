/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};
// 记录当前页面的表单选项
var pageState = {
    nowSelectCity:"北京",
    nowGraTime: "week"
}
// 用于渲染图表的数据
var chartData = {};
/**
 * 渲染图表
 */
function renderChart() {
    var str ="";
    for(var value in chartData) {
        str +="<div class='outer "+pageState['nowGraTime']+"'>";
        str +="<div class='chart "+pageState['nowGraTime']+"' style='height:"+chartData[value]+"px; background-color:#"+randomColor()+";' title='"+pageState['nowSelectCity']+":"+value+":"+ chartData[value]+"'>"+" </div>";
        str +="</div>";
    }
    document.getElementsByClassName("aqi-chart-wrap").innerHTML = str;
}
/**
 * 获取随机颜色
 */
function randomColor() {
    var rand = Math.floor(Math.random() * 0xFFFFFF).toString(16);
    if(rand.length === 6) {
        return rand;
    }else {
        return randomColor();
    }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 确定是否选项发生了变化
    var currd=getRadioVal();
    if(currd === pageState['nowGraTime']){
        return;
    }

    // 设置对应数据
    initAqiChartData()
    // 调用图表渲染函数
    renderChart();

}
function getRadioVal(){
    var rdlist=document.getElementsByName("gra-time");
    var currd="";
    for(var i=0;i<rdlist.length;i++){
        if(rdlist[i].checked){
            currd=rdlist[i].value;
        }
    }
    return currd;
}

/**
 * select发生变化时的处理函数
 */
/**
 * 获取当前select中option的值
 */
function getOptionVal() {
    var selt = document.getElementById("city-select");
    var index = selt.selectedIndex;
    var city = selt.options[index].value;
    return city;
}
/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化
    var city = getOptionVal();
    if(city ===pageState['nowSelectCity']) {
        return;
    }
    // 设置对应数据
    initAqiChartData();
    // 调用图表渲染函数
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var rdlist = document.getElementsByName("gra-time");
    for(var i=0;i<rdlist.length;i++){
        rdlist[i].addEventListener("click",graTimeChange,false);
    }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var select=document.getElementById("city-select")
   // var fragment=document.createDocumentFragment();

   // console.log(select.innerHTML)
    for(var city in aqiSourceData) {
        var option=document.createElement("option");
        option.innerHTML=city;
       // fragmen.appendChild(option);
        select.appendChild(option);
    }
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    select.addEventListener("change",citySelectChange,false);
}
/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    var radio = getRadioVal();
    var city = getOptionVal();
    pageState['nowGraTime'] = radio;
    pageState['nowSelectCity'] = city;
    switch (radio) {
        case "day":
            chartData={};
            chartData = aqiSourceData[city];break;

        case "week" :
            chartData ={};
            var datas = aqiSourceData[city];
            var count = 0, week = 0, total =0;
            var weeks= ['第一周','第二周','第三周','第四周','第五周','第六周','第七周','第八周','第九周','第十周','第十一周','第十二周','第十三周','第十四周','第十五周','第十六周'];
            for(var dayer in datas) {
                var everyDay = new Date(dayer);
                var wekDa = everyDay.getDay();
                if(wekDa === 6) {//如果是周日
                    count++;
                    total += datas[dayer];
                    chartData[weeks[week]] =Math.round(total/count);
                    week++;
                    count = 0;
                    total = 0;
                } else {
                    count++;
                    total += datas[dayer];
                }
            }
            chartData[weeks[week]] =Math.round(total/count);

            console.log(chartData)
            break;
        case "month":
            chartData={};
            var charmonth = aqiSourceData[city];
            var month1 = 0, month2 = 0, month3 = 0, count1 = 0, count2 = 0, count3 = 0;
            for (var dayer in charmonth) {
                var everyday = new Date(dayer);
                var month = everyday.getMonth();
                if (month == 0) {
                    month1 += charmonth[dayer];
                    count1++;
                    chartData["一月"] = Math.round(month1 / count1);
                }
                if (month == 1) {
                    month1 += charmonth[dayer];
                    count2++;
                    chartData["二月"] = Math.round(month1 / count2);
                }
                if (month == 2) {
                    month1 += charmonth[dayer];
                    count2++;
                    chartData["三月"] = Math.round(month1 / count2);
                }
            }
            break;
    }

    renderChart();
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm()
    initCitySelector();
    initAqiChartData();
}

init();
/**
 * Created by Administrator on 2016/3/30.
 */
