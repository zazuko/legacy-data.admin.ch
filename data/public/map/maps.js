//sgvizler hook

sgvizler.visualization.swisschoropleth = function(container) {this.container = container;};
sgvizler.visualization.swisschoropleth.prototype = {
     id:   "swisschoropleth",
     draw: function(data, opt) {

var width = 960,
    height = 500;

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 255)
    .style("color", "black")
    .style("background-color", "white")
    .style("padding", "2px");

var projection = d3.geo.albers()
    .rotate([0, 0])
    .center([8.43, 46.8])
    .scale(13600);
 
var path = d3.geo.path()
  .projection(projection);

d3.select(this.container).select("p").remove()
var svg = d3.select(this.container).append("svg")
    .attr("width", width)
    .attr("height", height);

var fill = d3.scale.log()
    .domain([opt.domainmin, opt.domainmax])
    .range([opt.colormin, opt.colormax]);



queue()
    .defer(d3.json, "swiss-maps/topojson/swiss-municipalities-simplified.json") 
    .await(ready);

    var d_array = {};
    for (r = 0; r < data.getNumberOfRows(); r += 1) {
        d_array[data.getValue(r, 0)] = {c: [{v:data.getValue(r, 0)}, {v:data.getValue(r,1)}]};
    }
    var da = _.object(_.map(d_array, function (obj) {return [obj.c[0].v, obj.c[1].v];}));

    function ready(error, swiss) {

 svg.append("g")
      .attr("class", "municipality-boundary")
    .selectAll("path")
      .data(topojson.object(swiss, swiss.objects["swiss-municipalities"]).geometries)
    .enter().append("path")
      .attr("data", function(d) { return da[d.properties.bfsNo]; })
      .on("mousemove", function(d){mousemove(d);})
      .attr("d", path)
      .style("fill", function(d) { return fill(da[d.properties.bfsNo])});
};	

function mousemove(d) {
	div
		.text(d.properties.name + " (" + d.properties.bfsNo + "): " + da[d.properties.bfsNo])
		.style("left", (d3.event.pageX ) + 10 + "px")
		.style("top", (d3.event.pageY) + "px");
}

d3.json("swiss-maps/topojson/switzerland-simplified.json", function(error, topology) {
  svg.append("path")
      .datum(topojson.mesh(topology, topology.objects["swiss-cantons"], function(a, b) { return a.properties.no !== b.properties.no}))
      .attr("d", path)
      .attr("class", "canton-boundary");

  svg.append("path")
      .datum(topojson.mesh(topology, topology.objects["swiss-cantons"], function(a, b) { return a.properties.no === b.properties.no; }))
      .attr("d", path)
      .attr("class", "land-boundary");
});	
     }
 };
