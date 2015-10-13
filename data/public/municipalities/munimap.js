//sgvizler hook
var initializeMap;

sgvizler.visualization.munimap = function(container) {this.container = container;};
sgvizler.visualization.munimap.prototype = {
     id:   "munimap",
     draw: function(data, opt) {

var width = 500,
    height = 300;
    coord = data.zf[0].c;
console.log(data);

function loadScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAFRTcPPyYit9ERj9COlgpgYW-Ve-lUeUs&sensor=false&callback=initializeMap";
    document.body.appendChild(script);
}

initializeMap = function () {
    var myLatlng = new google.maps.LatLng(coord[0].v, coord[1].v);
    var mapOptions = {
        center: myLatlng,
        disableDefaultUI: true,
        zoomControl: true,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
/*    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 3,
        },
        title: coord[2].v,
    });
*/
}

var mapTemplate;
mapTemplate = Handlebars.compile($("#map-template").html());
$(this.container).html(mapTemplate());
loadScript();

     }
 };
