
//------------------------------------------------
//Semantic Ko Model
//-------------------------------------------------


function Rdfvis(){
	this.model = {
			initialize: function(){
				
				console.log("rdfvis initialize");
				
				sko.registerPrefix('gz', '<http://data.gemeindezukunft.ch/vocab/>' );
				sko.store.execute("SELECT  ?munuri	WHERE {	?munuri a <http://data.gemeindezukunft.ch/vocab/Municipality>;}",function(success, results) {
					  // process the query results
					  var curies = [];
					  var curie;
					  for(var i=0; i<results.length; i++) {
					    curie = function(){};
					    curie.municipalityUri =  sko.rdf.prefixes.shrink(results[i].munuri.value);
					    curies.push(curie);
					  }

					  var viewModel = {entries: ko.observableArray(curies)};
					  
					  
					  sko.applyBindings("#body", viewModel);
					});
			},
	};
}
