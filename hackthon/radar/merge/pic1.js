var pic1svg = d3.select("#id_svg1");
// play按钮的背景
var clickButtonImage = `<g>	<circle style="fill:#A4C2F7;" cx="256" cy="256" r="247.467"/>	<linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="-48.7641" y1="652.5549" x2="-48.0151" y2="651.8834" gradientTransform="matrix(443.7334 0 0 -494.9333 21728.0684 323061.0313)"><stop  offset="0" style="stop-color:#D4E1F4"/><stop  offset="0.1717" style="stop-color:#D4E1F4"/><stop  offset="0.2" style="stop-color:#D4E1F4"/><stop  offset="0.2001" style="stop-color:#DAE4F4"/><stop  offset="0.2007" style="stop-color:#EBEBF4"/><stop  offset="0.2014" style="stop-color:#F6F1F4"/><stop  offset="0.2023" style="stop-color:#FDF4F4"/><stop  offset="0.205" style="stop-color:#FFF5F4"/><stop  offset="0.2522" style="stop-color:#FFF5F4"/><stop  offset="0.26" style="stop-color:#FFF5F4"/><stop  offset="0.26" style="stop-color:#D4E1F4"/><stop  offset="0.3974" style="stop-color:#D4E1F4"/><stop  offset="0.42" style="stop-color:#D4E1F4"/><stop  offset="0.4201" style="stop-color:#DAE4F4"/><stop  offset="0.4207" style="stop-color:#EBEBF4"/><stop  offset="0.4214" style="stop-color:#F6F1F4"/><stop  offset="0.4223" style="stop-color:#FDF4F4"/><stop  offset="0.425" style="stop-color:#FFF5F4"/><stop  offset="0.4894" style="stop-color:#FFF5F4"/><stop  offset="0.5" style="stop-color:#FFF5F4"/><stop  offset="0.5" style="stop-color:#F9F2F4"/><stop  offset="0.5001" style="stop-color:#E8EBF4"/><stop  offset="0.5003" style="stop-color:#DDE5F4"/><stop  offset="0.5005" style="stop-color:#D6E2F4"/><stop  offset="0.501" style="stop-color:#D4E1F4"/><stop  offset="0.7062" style="stop-color:#D4E1F4"/><stop  offset="0.74" style="stop-color:#D4E1F4"/><stop  offset="0.741" style="stop-color:#FFF5F4"/><stop  offset="0.8346" style="stop-color:#FFF5F4"/><stop  offset="0.85" style="stop-color:#FFF5F4"/><stop  offset="0.851" style="stop-color:#D4E1F4"/>	</linearGradient>	<ellipse style="fill:url(#SVGID_1_);" cx="256" cy="256" rx="221.867" ry="247.467"/>	<path style="fill:#FFFFFF;" d="M34.133,256C34.133,119.327,133.467,8.533,256,8.533C119.328,8.533,8.533,119.328,8.533,256S119.328,503.467,256,503.467C133.467,503.467,34.133,392.672,34.133,256z"/>	<path style="fill:#428DFF;" d="M256,512C114.615,512,0,397.385,0,256S114.615,0,256,0s256,114.615,256,256C511.84,397.319,397.319,511.84,256,512z M256,17.067C124.041,17.067,17.067,124.041,17.067,256S124.041,494.933,256,494.933S494.933,387.959,494.933,256C494.785,124.102,387.898,17.215,256,17.067z"/>	<polygon style="fill:#7FACFA;" points="384,256 196.267,384 196.267,258.33 196.267,128 	"/>	<path style="fill:#A4C2F7;" d="M362.985,248.326c-14.436-23.038-58.295-43.766-81.637-59.611c-20.065-13.621-40.944-24.279-59.481-39.138v220.26c5.551-3.119,11.024-6.267,16.522-9.404c-1.827-4.199-0.237-9.101,3.707-11.427c3.453-1.592,7.049-2.856,10.739-3.775c1.463-0.384,2.997-0.402,4.468-0.054c16.151-16.245,34.206-30.479,53.771-42.393c0.495-0.223,1.008-0.401,1.535-0.532c0.6-0.621,1.279-1.159,2.021-1.601c11.388-6.686,23.085-12.694,34.911-18.433c-1.889-4.146-0.393-9.049,3.489-11.433c5.177-3.4,11.02-5.656,17.139-6.62c0.979-0.12,1.968-0.132,2.949-0.035c0.873-3.448,0.28-7.104-1.64-10.098C369.557,251.037,366.483,248.972,362.985,248.326z"/>	<path style="fill:#428DFF;" d="M196.267,392.533c-4.711-0.004-8.53-3.822-8.533-8.533V128c0.001-3.163,1.752-6.065,4.548-7.543c2.796-1.478,6.18-1.288,8.794,0.493l187.733,128c2.331,1.59,3.725,4.229,3.725,7.05c0,2.821-1.394,5.46-3.725,7.05l-187.733,128C199.657,392.016,197.982,392.533,196.267,392.533L196.267,392.533z M204.8,144.15v223.7L368.854,256L204.8,144.15z"/></g>`;
pic1svg.attr("width",800).attr("height",400);

var playerColorList = ["#CB4335", "#7D3C98","#2E86C1", "#138D75", "#F1C40F", "#A6ACAF", "#616A6B", "#212F3D"];
d3.csv("playerHistory.csv", function(err, data) {
    var width = 550, height = 350;
    // 数据初步处理
    var domain = getXYrange("Points","Assists", data);
    var groupData = groupByPlayer(data);
    
    var localg = pic1svg.append("g").attr("transform", "translate(20,20)");
    // 定义xy轴的比例尺
    var xscale = d3.scaleLinear().rangeRound([0, width]).domain(domain[0]);
    var yscale = d3.scaleLinear().rangeRound([height, 0]).domain(domain[1]);
    var elements = [];
    // 画xy轴
    localg.append("g").attr("class", "axis_x").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(xscale));
    localg.append("g").attr("class", "axis_y").call(d3.axisLeft(yscale).ticks(8));
    localg.append("text").attr("transform","translate(10,0)").text("Assists");
    localg.append("text").attr("transform","translate("+width+","+(height-10)+")").style("text-anchor", "middle").text("Points");
    // 画 play 按钮，并定义点击事件
    localg.append('svg')
            .attr("cursor", "pointer")
            .attr("x", width + 70)
            .attr("y", height - 20)
            .attr("height",40)
            .attr("width",40)
            .attr("viewBox","0 0 512 512")
            .html(clickButtonImage)
            .on("click", function(){
                for(var i=0;i<elements.length;i++){
                    transition(elements[i])
                }
            })
    // 定义线的画法
    var line = d3.line()
        .x(function(d) { return xscale(d.points); })
        .y(function(d) { return yscale(d.assists); });

    var colorcount = 0; // 记录当前颜色
    // 画右侧tooltip
    toolTip(groupData,width+100, 50);
    // 画圆圈和折线
    for(var player in groupData){
        localdata = groupData[player];
        var path = localg.append("path")
        .datum(localdata)
        .attr("class", "data")
        .attr("fill", "none")
        .attr("stroke", playerColorList[colorcount])
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 4)
        .attr("opacity", .3)
        .attr("d", line)
        
        var circle = localg.append("circle")
            .attr("r", 1)
            .attr("fill", playerColorList[colorcount++])
            .attr("stroke","black")
            .attr("transform", "translate(0,0)");
        var tmparr = [circle, path, localdata, "VROP"];
        elements.push(tmparr)
        transition(tmparr); 
    }
});

function transition(item) {
    // 参数 item = [circle, path, localdata, attrname]
    // 该函数控制
    item[0].transition()
      .duration(5000)
      .attrTween("transform", translateCirclePath(item[1].node()) )
      .attrTween("r", translateCircleSize(item[2], item[3]))
    item[1].transition()
      .duration(5000)
      .attrTween("stroke-dasharray", translatePath);
}

function translateCirclePath(path) {
    // 定义动画过程
    var l = path.getTotalLength();
    return function(d, i, a) {
      return function(t) {
        var p = path.getPointAtLength(t * l);
        return "translate(" + p.x + "," + p.y + ")";
      };
    };
}

function translateCircleSize(localdata, attrname) {
    // 定义圆圈大小的动画过程
    return function(d, i, a) {
      return function(t) {
        var index = parseInt(t * localdata.length);
        if(index < localdata.length){
            return localdata[index][attrname] * 1.5
        }
        else{
            return localdata[index-1][attrname] * 1.5;
        }
      };
    };
}

function translateCircleBorder(localdata, attrname){
    // 定义圆圈边线的动画过程， 可以更改，目前是固定值，该函数并没有使用
    return function(d, i, a) {
        return function(t) {
          var index = parseInt(t * localdata.length);
          if(index < localdata.length){
              return localdata[index][attrname];
          }
          else{
              return localdata[index-1][attrname];
          }
        };
    };
}

function translatePath() {
    // 定义折线的动画过程
    var l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function (t) { 
        return i(t); };
}

function toolTip(groupData, left, top){
    // 右侧提示，不同颜色的线表示不同的人
    var localg = pic1svg.append("g").attr("transform", "translate("+left+","+top+")");
    var index = 0;
    var tipmargin = 45;
    for(var player in groupData){
        localg.append("rect")
            .attr("width", 25)
            .attr("height", 4)
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("y", index * tipmargin)
            .attr("fill", playerColorList[index])
        localg.append("text") // content of text will be defined later
            .attr("y", index * tipmargin + 14)
            .attr("x", 10)
            .attr("fill", playerColorList[index])
            .attr("text-anchor", "middle")
            .attr("font-size", 10)
            .text(player)
        index++;
    }
}
function groupByPlayer(data){
    /* 把数据按照player处理成 
    groupData = {
        player1: [{}, {}, {}, {}, {}, {}],
        player2: [{}, {}, {}, {}, {}, {}],
        player3: [{}, {}, {}, {}, {}, {}]
    } 
    这样的形式
    */
    data = data.map(function (d, i) {
        return {season: parseInt(d.Season),player: d.Player, points: parseFloat(d.Points), assists:parseFloat(d.Assists),WS:parseFloat(d.WS),VROP:parseFloat(d.VROP)}
    })
    var groupData = {}
    data.forEach(item => {
        if(groupData[item.player] == undefined){
            groupData[item.player] = [item]
        }else{
            groupData[item.player].push(item)
        }
    });
    for(var key in groupData){
        groupData[key] = groupData[key].reverse()
    }
    return groupData;
}
function getXYrange(attrx, attry, data){
    // attrx attry 表示xy轴所取的属性名, 得到[[minX, maxX] , [minY, maxY]]
    var tmpx = [], tmpy = [];
    for(var i=0;i<data.length;i++){
        tmpx.push(data[i][attrx])
        tmpy.push(data[i][attry])
    }
    return [[Math.min(...tmpx), Math.max(...tmpx)],[Math.min(...tmpy), Math.max(...tmpy)]]
}


