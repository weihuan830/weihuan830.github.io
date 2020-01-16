var margin = { top: 100, right: 100, bottom: 100, left: 100 },
    width = 300,
    height = 300;
var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 0.5,
    levels: 5,
    opacityCircles: 0.1,
    dotRadius: 4,
    opacityArea: 0.35,
    labelFactor: 1.1, //How much farther than the radius of the outer circle should the labels be placed
    roundStrokes: true,
    getcolor: function(index) {
        let colorList = ["#CB4335", "#7D3C98", "#2E86C1", "#138D75", "#F1C40F", "#A6ACAF", "#616A6B", "#212F3D"];
        return colorList[index]
    },
    playerchecked: {}
};
d3.csv("stats_players.csv", function(data) {
    addHtml(data)
    window.rawData = data
    filterPlayer()
})

function filterPlayer() {
    var data = window.rawData;
    var newdata = [];
    for (var i = 0; i < data.length; i++) {
        var tmp = [];
        tmp.push({ axis: "Points", value: parseFloat(data[i]["Points"]), index: i, name: data[i]["Player"], show: radarChartOptions.playerchecked[data[i]["Player"]] });
        tmp.push({ axis: "Assists", value: parseFloat(data[i]["Assists"]), index: i, name: data[i]["Player"], show: radarChartOptions.playerchecked[data[i]["Player"]] });
        tmp.push({ axis: "WS", value: parseFloat(data[i]["WS"]), index: i, name: data[i]["Player"], show: radarChartOptions.playerchecked[data[i]["Player"]] });
        tmp.push({ axis: "VROP", value: parseFloat(data[i]["VROP"]), index: i, name: data[i]["Player"], show: radarChartOptions.playerchecked[data[i]["Player"]] });
        tmp.push({ axis: "Steals", value: parseFloat(data[i]["Steals"]), index: i, name: data[i]["Player"], show: radarChartOptions.playerchecked[data[i]["Player"]] });
        tmp.push({ axis: "BPM", value: parseFloat(data[i]["BPM"]), index: i, name: data[i]["Player"], show: radarChartOptions.playerchecked[data[i]["Player"]] });
        newdata.push(tmp)
    }
    RadarChart(newdata, radarChartOptions);
}

function RadarChart(data, options) {
    var cfg = {};
    //Put all of the options into a variable called cfg
    if ('undefined' !== typeof options) {
        for (var i in options) {
            if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
        }
    }
    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    var maxValueArr = [];
    for (var i = 0; i < data[0].length; i++) {
        var localmax = 0;
        for (var t = 0; t < data.length; t++) {
            if (localmax < data[t][i]["value"]) {
                localmax = data[t][i]["value"];
            }
        }
        maxValueArr.push(localmax);
    }
    var allAxis = (data[0].map(function(i, j) { return i.axis })), //Names of each axis
        total = allAxis.length, //The number of different axes
        radius = Math.min(cfg.w / 2, cfg.h / 2), //Radius of the outermost circle
        angleSlice = Math.PI * 2 / total; //The width in radians of each "slice"
    //Scale for the radius
    var rScale = maxValueArr.map((item, i) => {
        return d3.scaleLinear()
            .range([0, radius])
            .domain([0, maxValueArr[i]]);
    });
    //Initiate the radar chart SVG
    var svg = d3.select("#id_radarChart")
        .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
    svg.selectAll("*").remove()
        //Append a g element		
    var g = svg.append("g").attr("transform", "translate(270,250)");
    //circle grid & axes
    var axisGrid = g.append("g").attr("class", "axisWrapper");
    //Draw the background circles
    axisGrid.selectAll(".levels")
        .data(d3.range(1, (cfg.levels + 1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function(d, i) { return radius / cfg.levels * d; })
        .style("fill", "lightgray")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)

    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
    //Append the lines
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function(d, i) { return rScale[i](maxValueArr[i] * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("y2", function(d, i) { return rScale[i](maxValueArr[i] * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); })
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");
    //Append the labels at each axis
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function(d, i) { return rScale[i](maxValueArr[i] * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("y", function(d, i) { return rScale[i](maxValueArr[i] * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2); })
        .text(function(d) { return d })
        //The radial line function
    var radarLine = d3.radialLine()
        .curve(d3.curveLinearClosed)
        .radius(function(d, i) { return rScale[i](d.value); })
        .angle(function(d, i) { return i * angleSlice; })
    if (cfg.roundStrokes) { radarLine.curve(d3.curveCardinalClosed) }
    //Create a wrapper for the blobs	
    var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");
    //Append the backgrounds	
    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function(d, i) { return radarLine(d); })
        .style("fill", function(d, i) { return cfg.getcolor(i); })
        .style("fill-opacity", function(d, i) {
            if (d[0]["show"]) {
                return cfg.opacityArea
            }
            return 0;
        })
        .on('mouseover', function(d, i) {
            //Dim all blobs
            d3.selectAll(".radarArea").transition().duration(200).style("fill-opacity", function(d, i) {
                if (d[0]["show"]) {
                    return cfg.opacityArea
                }
                return 0;
            });
            //Bring back the hovered over blob
            d3.select(this).transition().duration(200).style("fill-opacity", function(d, i) {
                if (d[0]["show"]) {
                    return cfg.opacityArea
                }
                return 0;
            });
        })
        .on('mouseout', function() {
            //Bring back all blobs
            d3.selectAll(".radarArea").transition().duration(200).style("fill-opacity", function(d, i) {
                if (d[0]["show"]) {
                    return cfg.opacityArea
                }
                return 0;
            });
        });

    //Create the outlines	
    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function(d, i) { return radarLine(d); })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function(d, i) { return cfg.getcolor(i); })
        .style("opacity", function(d, i) {
            if (d[0]["show"]) {
                return 1
            }
            return 0;
        })
        .style("fill", "none")
}

function addHtml(data) {
    var str = "";
    for (var i = 0; i < data.length; i++) {
        str += `<div style="padding:10px">
			<input onchange="checkchange('` + data[i]["Player"] + `', this)" type="checkbox">
			<label>` + data[i]["Player"] + `</label>
			</div>`
    }
    document.getElementById("checkList").innerHTML = str
}

function checkchange(name, ele) {
    radarChartOptions.playerchecked[name] = ele.checked;
    filterPlayer()
}