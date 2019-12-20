var margin = { top: 100, right: 20, bottom: 20, left: 150 },
    width = window.innerWidth * 0.6,
    height = window.innerHeight * 0.5;
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
var data = [{
        "Fund": "Allianz China Equity (A Dis) (HKD)",
        "Annual Returns": [-3.31, -0.61, 36.91, -17.64, 10.28],
        "3 Year Sharpe Ratio": "0.38",
        "3 Year Standard Deviation": "16.51%",
        "3 Year Alpha": "-3.31%",
        "Risk Rating": 4,
        "Morningstar Rating": 3,
        "Equity Holdings Sector Allocation": {
            "Consumer Cyclical": 22.51,
            "Financial Services": 18.57,
            "Industrials": 12.67,
            "Communication Services": 11.85,
            "Technology": 9.29,
            "Consumer Defensive": 8.78,
            "Real Estate": 4.96,
            "Healthcare": 3.47,
            "Basic Materials": 3.00,
            "Energy": 2.94,
            "Utilities": 0.75
        }
    },
    {
        "Fund": "BOCHK China Equity Fund",
        "Annual Returns": [-9.36, -0.96, 44.90, -20.06, 12.45],
        "3 Year Sharpe Ratio": "0.43",
        "3 Year Standard Deviation": "18.40%",
        "3 Year Alpha": "-2.85%",
        "Risk Rating": 4,
        "Morningstar Rating": 3,
        "Equity Holdings Sector Allocation": {
            "Consumer Cyclical": 17.03,
            "Financial Services": 25.34,
            "Industrials": 4.60,
            "Communication Services": 4.41,
            "Technology": 17.85,
            "Consumer Defensive": 4.61,
            "Real Estate": 8.58,
            "Healthcare": 3.47,
            "Basic Materials": 3.83,
            "Energy": 4.63,
            "Utilities": 2.78
        }
    },
    {
        "Fund": "JPMorgan China A-Share Opportunities Fund (acc) - HKD",
        "Annual Returns": [-2.38, -18.46, 48.82, -28.67, 41.13],
        "3 Year Sharpe Ratio": "0.60",
        "3 Year Standard Deviation": "20.31%",
        "3 Year Alpha": "12.82%",
        "Risk Rating": 5,
        "Morningstar Rating": 3,
        "Equity Holdings Sector Allocation": {
            "Consumer Cyclical": 3.27,
            "Financial Services": 23.26,
            "Industrials": 11.55,
            "Communication Services": 0.72,
            "Technology": 18.84,
            "Consumer Defensive": 17.71,
            "Real Estate": 5.83,
            "Healthcare": 14.21,
            "Basic Materials": 1.78,
            "Energy": 0,
            "Utilities": 1.71
        }
    },
    {
        "Fund": "Schroder ISF-Hong Kong Equity (Acc)",
        "Annual Returns": [-5.24, 0.48, 51.63, -14.12, 8.82],
        "3 Year Sharpe Ratio": "0.59",
        "3 Year Standard Deviation": "17.56%",
        "3 Year Alpha": "2.12%",
        "Risk Rating": 4,
        "Morningstar Rating": 5,
        "Equity Holdings Sector Allocation": {
            "Consumer Cyclical": 23.78,
            "Financial Services": 25.26,
            "Industrials": 12.97,
            "Communication Services": 2.48,
            "Technology": 5.92,
            "Consumer Defensive": 4.04,
            "Real Estate": 14.33,
            "Healthcare": 4.68,
            "Basic Materials": 0.33,
            "Energy": 4.79,
            "Utilities": 0
        }
    },
    {
        "Fund": "AB SICAV I - India Growth Portfolio (A HKD)",
        "Annual Returns": [-4.76, -3.68, 52.05, -23.22, 0.40],
        "3 Year Sharpe Ratio": "0.30",
        "3 Year Standard Deviation": "18.24%",
        "3 Year Alpha": "-5.32%",
        "Risk Rating": 5,
        "Morningstar Rating": 2,
        "Equity Holdings Sector Allocation": {
            "Consumer Cyclical": 6.08,
            "Financial Services": 40.50,
            "Industrials": 15.83,
            "Communication Services": 4.53,
            "Technology": 12.68,
            "Consumer Defensive": 2.88,
            "Real Estate": 1.63,
            "Healthcare": 0,
            "Basic Materials": 2.58,
            "Energy": 6.01,
            "Utilities": 7.29
        }
    }
]


window.rawData = data
    // addHtml(data)
filterPlayer()

function filterPlayer() {
    var data = window.rawData;
    var newdata = [];
    for (var i = 0; i < data.length; i++) {
        var tmp = [];
        tmp.push({ axis: "Annual Returns", value: parseFloat(data[i]["Annual Returns"]), index: i, name: data[i]["Fund"], show: true });
        tmp.push({ axis: "3 Year Sharpe Ratio", value: parseFloat(data[i]["3 Year Sharpe Ratio"]), index: i, name: data[i]["Fund"], show: true });
        tmp.push({ axis: "3 Year Standard Deviation", value: parseFloat(data[i]["3 Year Standard Deviation"]), index: i, name: data[i]["Fund"], show: true });
        tmp.push({ axis: "3 Year Alpha", value: parseFloat(data[i]["3 Year Alpha"]), index: i, name: data[i]["Fund"], show: true });
        tmp.push({ axis: "Risk Rating", value: parseFloat(data[i]["Risk Rating"]), index: i, name: data[i]["Fund"], show: true });
        tmp.push({ axis: "Morningstar Rating", value: parseFloat(data[i]["Morningstar Rating"]), index: i, name: data[i]["Fund"], show: true });
        newdata.push(tmp)
    }
    for (let i = 0; i < newdata[0].length; i++) {
        let keyarray = newdata.map(item => item[i]['value']);
        let minv = Math.min(...keyarray);
        if (minv < 0) {
            let abs = Math.abs(minv)
            for (let t = 0; t < newdata.length; t++) {
                newdata[t][i]['value'] += abs
            }
        }
    }
    console.log(newdata)
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
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight * 0.5)
    svg.selectAll("*").remove()
        //Append a g element		
    var g = svg.append("g").attr("transform", "translate(170,180)");
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
			<input onchange="checkchange('` + data[i]["Fund"] + `', this)" type="checkbox">
			<label>` + data[i]["Fund"] + `</label>
			</div>`
    }
    document.getElementById("checkList").innerHTML = str
}

function checkchange(name, ele) {
    radarChartOptions.playerchecked[name] = ele.checked;
    filterPlayer()
}
