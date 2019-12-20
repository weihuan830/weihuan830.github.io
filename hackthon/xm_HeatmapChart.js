var margin = { top: 20, right: 100, bottom: 20, left: 20 },
    width = 700 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 13),
    transleft = 100,
    legendElementWidth = gridSize * 2,
    buckets = 9,
    colors = ["#f3f0f9", "#ece7f6", "#e5def3", "#ddd4ef", "#dad0ee", "#c4bbd6", "#aea6be", "#9891a6", "#6d6877"],
    days = [],
    times = [];

var datasets = [{
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

for (var i = 0; i < datasets.length; i++) {
    days.push([datasets[i]["Fund"], datasets[i]["Fund"].split(" ")[0]])
}

for (var j = 0; j < Object.keys(datasets[0]["Equity Holdings Sector Allocation"]).length; j++) {
    times.push([Object.keys(datasets[0]["Equity Holdings Sector Allocation"])[j], Object.keys(datasets[0]["Equity Holdings Sector Allocation"])[j].slice(0, 4)])
}

var svg = d3.select("#id_heatmapChart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var dayLabels = svg.selectAll(".dayLabel")
    .data(days)
    .enter().append("text")
    .text(function(d) { return d[1]; })
    .attr("x", 0)
    .attr("y", function(d, i) { return i * gridSize; })
    .style("font-size", 18)
    .style("text-anchor", "end")
    .attr("transform", "translate(" + transleft + "," + (gridSize / 1.5 + margin.top) + ")")
    .attr("class", function(d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

var timeLabels = svg.selectAll(".timeLabel")
    .data(times)
    .enter().append("text")
    .text(function(d) { return d[1]; })
    .attr("x", function(d, i) { return i * gridSize; })
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + (gridSize / 2 + transleft + margin.left) + "," + (margin.top - 6) + ")");

var heatmapChart = function(data, svg) {
    var largestRatio = 0;
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < times.length; j++) {
            if (data[i]["Equity Holdings Sector Allocation"][times[j][0]] > largestRatio) {
                largestRatio = data[i]["Equity Holdings Sector Allocation"][times[j][0]]
            }
        }
    }
    var colorScale = d3.scaleQuantile()
        .domain([0, buckets - 1, largestRatio])
        .range(colors);
    console.log(largestRatio)
    for (var k = 0; k < days.length; k++) {
        console.log(data[k]["Equity Holdings Sector Allocation"])
        var columnData = []
        for (var i = 0; i < times.length; i++) {
            columnData.push([times[i][0], data[k]["Equity Holdings Sector Allocation"][times[i][0]]])
        }

        var cards = svg.selectAll(".fund_" + String(k))
            .data(columnData)
            .enter().append("rect")
            .attr("x", function(d, i) { console.log([d, i]); return i * gridSize; })
            .attr("y", function(d) { return k * gridSize; })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", colors[0])
            .attr("transform", "translate(" + (margin.left + transleft) + "," + margin.top + ")");

        cards.append("title");

        cards.transition().duration(1000)
            .style("fill", function(d) { return colorScale(d[1]); });

        cards.select("title").text(function(d) { return d[1]; });

        cards.exit().remove();

        // var legend = svg.selectAll(".legend")
        //     .data([0].concat(colorScale.quantiles()), function(d) { return d; });

        // legend.enter().append("g")
        //     .attr("class", "legend");

        // legend.append("rect")
        //     .attr("x", function(d, i) { return legendElementWidth * i + margin.left; })
        //     .attr("y", height)
        //     .attr("width", legendElementWidth)
        //     .attr("height", gridSize / 2)
        //     .style("fill", function(d, i) { return colors[i]; });

        // legend.append("text")
        //     .attr("class", "mono")
        //     .text(function(d) { return "≥ " + Math.round(d); })
        //     .attr("x", function(d, i) { return legendElementWidth * i + margin.left;; })
        //     .attr("y", height + gridSize - 10)
        //     .style("font-size", 16);

        // legend.exit().remove();
    }
};

heatmapChart(datasets, svg);
