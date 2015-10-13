//sgvizler hook

sgvizler.visualization.munioverview = function(container) {this.container = container;};
sgvizler.visualization.munioverview.prototype = {
     id:   "munioverview",
     draw: function(data, opt) {

var width = 500,
    height = 300;
var infoTemplate;
infoTemplate = Handlebars.compile($("#info-template").html());
$(this.container).html(infoTemplate({data: data}))

     }
 };
