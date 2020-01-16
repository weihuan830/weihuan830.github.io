//Width and height for whole
var w = 970;
var h = 700;

//Define map projection
var projection = d3.geoAlbersUsa().translate([w/3, h/3.5]).scale([900]);

//Define path generator
var path = d3.geoPath().projection(projection);

//Map the rank to radius[2, 20]
var Scale = d3.scaleLinear().range([2, 20]);

//Create SVG element
var pic2svg = d3.select("#id_map")

var pic2g = pic2svg.append("g").attr("class","map");
//Creater a group to store states

var playerColorSet = {"James Harden": "#CB4335", 
"Giannis Antetokounmpo": "#7D3C98",
"Russell Westbrook": "#F1C40F",
"Kevin Durant": "#616A6B",
"Anthony Davis": "#ad4e8e",
"Donovan Mitchell": "#8eaac7",
"Jamal Crawford": "#c26736",
"Jamal Murray": "#1f4f6a",
"Klay Thompson": "#bfe1fd",
"LaMarcus Aldridge": "#8f91a4",
"Lou Williams": "#cfccaf",
"Zach LaVine": "#8980ad"}
//Load in state data, draw map
d3.csv("data/US-states.csv", function(data) {
    d3.json("data/US-geo.json", function(json) {
        for (var i = 0; i < data.length; i++) {
            var dataState = data[i].state;
            var dataEASTorWEST = data[i].EASTorWEST;
            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.name;
                if (dataState == jsonState) {
                    json.features[j].properties.EASTorWEST = dataEASTorWEST;
                    break;
                }
            }
        }

        pic2g.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("stroke","white")
            .attr("stroke-width",1)
            .attr("d", path)
            .attr("class", function(d) {
                return d.properties.postal;})
            .style("fill", function(d) {
                var EASTorWEST = d.properties.EASTorWEST;
                if (EASTorWEST) {
                    if (EASTorWEST == "East") {
                        return "#b0e0e6";
                    } else {
                        return "#faebd7";
                    }
                } else {
                    return "#CCCCCC";
                }
            })

        d3.csv("data/NBA-teams.csv", function(data) {
            d3.csv("data/points_player.csv", function(pointsdata){
                var st = {}, arr = [];
                data.forEach(element => {
                    st[element["teamname"]] = element;
                });
                var minP = Math.min.apply(Math, pointsdata.map(function(o) { return o["Points"]; }));
                pointsdata.forEach(element => {
                    if(st[element["OpTeam"]] != undefined){
                        arr.push(Object.assign({"Player":element["Player"], "Points":element["Points"],"radius":(minP-element["Points"])}, st[element["OpTeam"]]))
                    }
                })
                data = arr;
                Scale.domain([0, d3.max(data, function(d) { return d["Points"]; })]);
                var nodes = pic2g.selectAll("nodes")
                    .data(data)
                    .enter()
                    .append("g")
                    .attr("class", "players")
                    .attr("transform", function(d) { return "translate(" + projection([d.lon, d.lat])[0] + "," + projection([d.lon, d.lat])[1] + ")";})
                    .on("mouseover", nodeMouseover)
                    .on("mouseout", nodeMouseout);
                nodes.append("circle")
                    .attr("r", function(d){ return Scale(d["Points"]);})
                    .style("fill", function(d){return playerColorSet[d["Player"]];})
                    .attr("opacity",0.7)
                    .style("cursor", "pointer")

                nodes.append("text")
                    .attr("dx", function(d){ return Scale(d["Points"]); })
                    .attr("dy", "-1.5em")
                    .attr("font-size", 10)
                    .style("fill", "#888888")
                    .style("opacity", 0)
                    .style("font-weight", "bold")
                    .style("cursor", "default")
                    .text(function(d) { return d["Player"];});
                var histg = pic2svg.append("g").attr("transform","translate(570,350)");
                drawHistogram(histg,data)
            })
        });
    });
});

//Emphasize
function nodeMouseover(d){
    d3.select(this).select("circle")
        .transition()
        .duration(100)
        .attr("r", function(d){ return 1.5 * Scale(d["Points"]); })
        .style("opacity", 1)
        .style("stroke-width", "1px");
    d3.select(this).select("text")
        .transition()
        .duration(200)
        .attr("dx", function(d){ return 1.5 * Scale(d["Points"]);})
        .style("fill", "#000000")
        .style("opacity", 1)
        .text(function(d) { return d["Player"] + " (" + d["Points"] + ")";});
    pic2g.append("image")
        .attr("xlink:href", "headimage/" + d["Player"].replace(" ","-") + ".png")
        .attr("width", 50)
        .attr("height", 50)
        .attr("x", projection([d.lon, d.lat])[0] + 20)
        .attr("y", projection([d.lon, d.lat])[1] - 20);
    d3.select("."+d["Player"].replace(" ","-")).style("opacity", 1);
    d3.select("._"+d["Player"].replace(" ","-")).style("opacity", 1);
}

//Get back to original status
function nodeMouseout(d){
    d3.select(this).select("circle")
        .transition()
        .duration(200)
        .attr("r", function(d) { return Scale(d["Points"]); })
        .style("opacity", 0.7)
        .style("stroke-width", "1px");

    d3.select(this).select("text")
        .transition()
        .duration(200)
        .attr("dx", function(d){ return Scale(d["Points"]);})
        .style("fill", "#888888")
        .style("opacity", 0)
        .text(function(d) { return d["Player"]});
    d3.select("."+d["Player"].replace(" ","-")).style("opacity", 0.7)
    d3.select("._"+d["Player"].replace(" ","-")).style("opacity", 0);
    pic2g.select("image").remove();
}

function drawHistogram(localg, localdata){
    var width = 300;
    var height = 150;
    var playerSet = {};
    var data = [];
    console.log(localdata)
    for(var i=0;i<localdata.length;i++){
        if(playerSet[localdata[i]["Player"]]==undefined){
            playerSet[localdata[i]["Player"]] = 1;
        }else{
            playerSet[localdata[i]["Player"]] += 1;
        }
    }
    for(key in playerSet){
        data.push({"key":key,"value":playerSet[key]})
    }

    var scaleX = d3.scaleBand()
    	.domain(data.map(function(d){ return d.key; }))
    	.range([0, width]);
    
    var scaleY = d3.scaleLinear()
      .domain([0, d3.max(data.map(function(d){ return d.value; }))])
      .range([0, height]);
    
    localg.selectAll('.rectbar')
    	.data(data)
    	.enter().append('rect')
    	.attr("class", function(d){return d["key"].replace(" ","-")})
        .attr("width", scaleX.bandwidth())
        .attr("fill",function(d){return playerColorSet[d["key"]];})
        .attr("stroke","white")
    	.attr("height", function(d){return scaleY(d.value); })
	    .attr("x", function(d){ return scaleX(d.key); })
        .attr("y", function(d){ return -scaleY(d.value); })
        .style("opacity", 0.7)
    
    localg.selectAll('.rectbar')
        .data(data).enter()
        .append("image")
        .attr("class", ".headimage")
        .attr("xlink:href", function(d){ return "headimage/" + d["key"].replace(" ","-") + ".png"})
        .attr("width", scaleX.bandwidth())
        .attr("height", 20)
        .attr("x", function(d){ return scaleX(d.key); })
        .attr("y", 0)
    localg.selectAll('.timestext')
    	.data(data)
        .enter().append('text')
        .attr("class", function(d,i){ return "_"+d["key"].replace(" ","-")})
        .attr("fill","black")
    	.attr("height", function(d){return scaleY(d.value); })
	    .attr("x", function(d){ return scaleX(d.key) + 5; })
        .attr("y", function(d){ return -scaleY(d.value) - 2; })
        .style("opacity", 0)
        .text(function(d, i){
            return d.value
        })
}
