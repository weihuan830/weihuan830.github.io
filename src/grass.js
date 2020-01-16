        let width = window.innerWidth;
        let height = 350;
        let svg = d3.select("#svg_grass").attr("width", width).attr("height", height);
        // var color = d3.scale.category20();
        var grassgreen = ["#136d15", "#117c13", "#138510", "#268b07", "#41980a"];
        var lineFunction = d3.line()
            .x(function(d) {
                return d[0];
            })
            .y(function(d) {
                return d[1];
            })
            .curve(d3.curveBasis);
        var alltypes = [
            [50, 150, "#008080"],
            [120, 150, "#9eccd3"],
            [190, 150, "#b0c6fb"],
            [260, 150, "#f4c8aa"],
            [330, 150, "#ffa153"],
            [400, 150, "#ac8dfd"],
            [470, 150, "#ccff00"],
            [540, 150, "#bbffff"],
        ]
        var alldata = [];
        var colors = [];
        var opa = [];
        var eachtype = [];
        var selectorRange = [];
        for (var i = 0; i < 1000; i++) {
            alldata.push(genData());
            colors.push(getRandomColor());
            opa.push(Math.random() + 0.4);
            eachtype.push([0, 1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5).slice(0, parseInt(Math.random() * 7) + 1));
        }

        var maxloop = 100
        var count = 1;
        run(count);
        // brush()

        function run(count) {
            svg.selectAll("*").remove();
            for (var t = 0; t < alldata.length; t++) {
                // console.log(growData(alldata[t]), i/10.0, i/10.0)
                svg.append("path")
                    .attr("d", lineFunction(growData(alldata[t], count / maxloop, count / maxloop)))
                    .attr("fill", colors[t])
                    .attr("opacity", opa[t] * count / maxloop)
                    .attr("storke-width", "1px")
                    .attr("transform", "translate(50, 300)")
            }
            // drawNut();
            // drawRoots(count/maxloop);
            count = count + 1;
            if (count > maxloop) {
                return;
            }
            setTimeout(function() {
                run(count)
            }, 10)
        }

        function genData() {
            var arr = [];
            var x1 = Math.random() * width;
            var x2 = Math.random() * 8;
            return genPoints(genTopPoint([
                [x1, 0],
                [x2 + x1, 0]
            ]));
        }

        function drawNut() {
            for (var i = 0; i < alltypes.length; i++) {
                svg.append("circle").attr("r", "10").attr("transform", function() {
                    return "translate(" + (50 + alltypes[i][0]) + "," + (300 + alltypes[i][1]) + ")";
                }).attr("fill", alltypes[i][2]);
            }
        }

        function brush() {
            svg.selectAll("*").remove();
            for (var i = 0; i < alldata.length; i++) {
                var mid = (alldata[i][0][0] + alldata[i][1][0]) / 2;
                var tf = true;
                if (selectorRange.length > 0) {
                    var tf = (mid >= selectorRange[0] && mid <= selectorRange[1]) ? true : false;
                }
                svg.append("path")
                    .attr("d", lineFunction(growData(alldata[i], 1, 1)))
                    .attr("fill", colors[i])
                    .attr("opacity", tf ? opa[i] : 0.05)
                    .attr("storke-width", "1px")
                    .attr("transform", "translate(50, 300)")
            }
            drawNut();
            drawRoots(1);
        }

        function drawRoots(percent) {
            for (var i = 0; i < eachtype.length; i++) {
                for (t = 0; t < eachtype[i].length; t++) {
                    var midx = (alldata[i][0][0] + alldata[i][1][0]) / 2;
                    var tf = true;
                    if (selectorRange.length > 0) {
                        tf = (midx >= selectorRange[0] && midx <= selectorRange[1]) ? true : false;
                    }
                    var dtx = (alltypes[eachtype[i][t]][0] - alldata[i][0][0]) * percent;
                    var dty = alltypes[eachtype[i][t]][1];
                    svg.append("path")
                        .attr("d", "M" + midx + ",0L" + (midx + dtx) + "," + (dty * percent))
                        .attr("stroke-width", tf ? 0.5 : 0.1)
                        .attr("opacity", tf ? 0.5 : 0.01)
                        .attr("stroke", alltypes[eachtype[i][t]][2])
                        .attr("transform", "translate(50, 300)")
                }
            }
        }

        function getRandomColor() {
            var t = parseInt(Math.random() * grassgreen.length);
            return grassgreen[t];
        }

        function growData(points, xper, yper) {
            var xmid = (points[0][0] + points[points.length - 1][0]) / 2;
            var newp = [];
            for (var i = 0; i < points.length; i++) {
                newp.push([xmid + (xmid - points[i][0]) * xper, yper * points[i][1]]);
            }
            return newp
        }

        function genPoints(point3) {
            var x1 = point3[0][0];
            var y1 = point3[0][1];
            var x2 = point3[1][0];
            var y2 = point3[1][1];
            var xtop = point3[2][0];
            var ytop = point3[2][1];
            var arr = [];
            var step = 5;
            var speedY = ytop / 15;
            arr.push([x1, y1])
            arr.push([x1 + (xtop - x1) / step * 1, speedY * 5])
            arr.push([x1 + (xtop - x1) / step * 2, speedY * 9])
            arr.push([x1 + (xtop - x1) / step * 3, speedY * 12])
            arr.push([x1 + (xtop - x1) / step * 4, speedY * 14])
            arr.push([x1 + (xtop - x1) / step * 5, speedY * 15])
            arr.push([x2 + (xtop - x2) / step * 4, speedY * 14])
            arr.push([x2 + (xtop - x2) / step * 3, speedY * 12])
            arr.push([x2 + (xtop - x2) / step * 2, speedY * 9])
            arr.push([x2 + (xtop - x2) / step * 1, speedY * 5])
            arr.push([x2, y2])
            return arr
        }

        function genTopPoint(point2) {
            var xpos = Math.random() * 200 - 100;
            var top = -Math.random() * 250;
            point2.push([xpos + (point2[0][0] + point2[1][0]) / 2, top])
                // console.log(xpos+(point2[0][0]+point2[][1])/2)
            return point2
        }

        function drawTri(points) {
            var s = "M";
            for (var i = 0; i < points.length; i++) {
                s += points[i][0] + "," + points[i][1] + "L"
            }
            s += points[0][0] + "," + points[0][1];
            return s;
        }