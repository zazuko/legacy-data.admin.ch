var rdfvis = new Rdfvis();

var sparqlUrl = 'http://data.gemeindezukunft.ch/sparql/query?query='


function init() {
	var query = 'PREFIX gz: <http://data.gemeindezukunft.ch/vocab/> 	CONSTRUCT{	?cantonuri a gz:Canton .	?cantonuri gz:cantonLongName ?cantonname	}	WHERE {	?cantonuri a gz:Canton;gz:cantonLongName ?cantonname	}';
	var datauri = sparqlUrl
			+ escape(query) + "&output=text/turtle";
	dereference(datauri, function(graph) {
		if (graph != null && graph.length) {
			if(debug)
				console.log("non empty graph");
			initGUI(graph, function() {
				rdfvis.model.initialize();
			});
		}
	});
}

// ------------------------------------------------
// Semantic Ko Model
// -------------------------------------------------

var resultViewModel = {
	self : this,
	gemeinde : ko.observable(),
	bfsnr : ko.observable(),
	startdate : ko.observable("01.01.1960"),
	enddate : ko.observable("01.04.2012"),
	stand20120401 : ko.observable(false),
	provMut : ko.observable(false),
	selectedCanton : ko.observable(),
	gemfreiGebSeen : ko.observable(false),
	makeQuery : function() {
		if(debug)
			console.log("querying...");
		var query = buildQuery(resultViewModel.gemeinde(), resultViewModel
				.stand20120401(), resultViewModel.bfsnr(), resultViewModel
				.startdate(), resultViewModel.enddate(), resultViewModel
				.provMut(), viewModel.selectedCanton().uri, resultViewModel
				.gemfreiGebSeen());
		var datauri = sparqlUrl
				+ encodeURIComponent(query) + "&output=text/turtle";
		dereference(datauri, function(graph) {
			if (graph != null && graph.length) {
				initGUI(graph, function() {
					rdfvis.model.query();
				});
			} else {
				if(debug)
					console.log("Empty graph!!");
				document.getElementById('results').style.display='none'; 
				document.getElementById('noresults').style.display=''; 
			}
		});
	}
};
var viewModel = {};

/**
 * generates the query with the given
 * parameter values
 * 
 * @param gemeindename name of the municipality
 * @param stand20120401 request the condition at the date 2012-4-1, overrides the values from startdate and enddate
 * @param bfsnr unique number of municipality
 * @param startdate
 * @param enddate
 * @param provMut show 
 * @param cantonUri URI of the canton
 * @param gemfreiGebSeen
 * @returns {String}
 */
function buildQuery(gemeindename, stand20120401, bfsnr, startdate, enddate,
		provMut, cantonUri, gemfreiGebSeen) {
	var query = 'PREFIX gz: <http://data.gemeindezukunft.ch/vocab/> PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#> ';
	query += 'CONSTRUCT { ?munuri a gz:Municipality; gz:municipalityId ?munid; gz:historyMunicipalityId ?histid; gz:districtHistId ?districtHistId; gz:districtId ?districtId; gz:cantonAbbreviation ?canton; gz:districtLongName ?districtName ; gz:municipalityLongName ?muniname; gz:municipalityAbolitionDate ?abolitionDate;gz:municipalityStatus ?status;gz:municipalityEntryMode ?entryMode; gz:municipalityAdmissionDate ?admissionDate; } ';
	query += 'WHERE { ';
	// adds the filter for cantons if necessary
	if (cantonUri) {
		query += '<' + cantonUri
				+ '> a gz:Canton; gz:cantonAbbreviation ?canton. ';
		if(debug)
			console.log("Filter for:" + cantonUri);
	}
	query += ' ?munuri a gz:Municipality; gz:municipalityId ?munid;  gz:municipalityEntryMode ?entryMode; gz:historyMunicipalityId ?histid;gz:municipalityStatus ?status; gz:cantonAbbreviation ?canton; gz:municipalityLongName ?muniname; gz:districtHistId ?districtHistId; gz:municipalityAdmissionDate ?admissionDate; gz:municipalityLongName ?muniname. ';

	if (gemeindename != null && gemeindename.length > 0)
		query += ' FILTER regex(?muniname, ".*' + gemeindename + '.*","i").';
	if (bfsnr != null && bfsnr.length > 0)
		query += ' FILTER (?munid = ' + bfsnr + ' ).';
	if (!provMut) {
		query += ' FILTER (?status = 1) .';
	}
	if (!gemfreiGebSeen) {
		query += ' FILTER (?entryMode != 12 && ?entryMode != 13) .';
	}

	if (!stand20120401) {

		if (startdate != null && startdate.length > 0) {
			var dateParts = startdate.split(".");

			var date = new Date(dateParts[2], (dateParts[1]), dateParts[0]);

			if (date) {
				query += ' FILTER (xsd:date(?admissionDate) >= "'
						+ date.toAmericanString() + '"^^xsd:date ). ';
			} else {
				console.log("Startdate was in the wrong format");
			}
		}

		if (enddate != null && enddate.length > 0) {
			var dateParts = enddate.split(".");

			var date = new Date(dateParts[2], (dateParts[1]), dateParts[0]);

			if (date) {
				query += ' FILTER (xsd:date(?admissionDate) <= "'
						+ date.toAmericanString() + '"^^xsd:date ). ';
			} else {
				console.log("Startdate was in the wrong format");
			}
		}

	} else {
		query += ' FILTER (xsd:date(?admissionDate) <= "2012-04-01"^^xsd:date ). ';
		query += ' FILTER (!bound(?abolitionDate) || xsd:date(?abolitionDate) > "2012-04-01"^^xsd:date ). ';
	}

	query += ' ?districturi gz:districtHistId ?districtHistId; gz:districtId ?districtId; gz:districtLongName ?districtName . OPTIONAL {?munuri gz:municipalityAbolitionDate ?abolitionDate} } ';
	
	
	//limit
	query += ' limit 100';
	if(debug)
		console.log(query);
	return query;
}

/**
 * @returns {Rdfvis}
 */
function Rdfvis() {
	this.model = {
		// initializes the select input of the form with the values from a query
		// for all cantons
		initialize : function() {
			if(debug)
				console.log("rdfvis initialize");

			sko.registerPrefix('gz', '<http://data.gemeindezukunft.ch/vocab/>');
			sko.store
					.execute(
							"SELECT  ?cantonuri  ?cantonname	WHERE {	?cantonuri a <http://data.gemeindezukunft.ch/vocab/Canton>;<http://data.gemeindezukunft.ch/vocab/cantonLongName> ?cantonname	} order by ?cantonname",
							function(success, results) {
								// process the query results
								var curies = [];
								var curie = function() {
								};
								;
								curie.cantonName = "Alle Kantone";
								curie.uri = "";
								curies.push(curie);
								for ( var i = 0; i < results.length; i++) {
									curie = function() {
									};
									curie.cantonName = sko.rdf.prefixes
											.shrink(results[i].cantonname.value);
									curie.uri = sko.rdf.prefixes
											.shrink(results[i].cantonuri.value);
									curies.push(curie);
								}

								viewModel.cantons = ko.observableArray(curies);
								viewModel.selectedCanton = ko.observable();

								applyBindings();
							});

		},
		/**
		 * Process query and display results
		 */
		query : function() {

			sko.registerPrefix('gz', '<http://data.gemeindezukunft.ch/vocab/>');
			sko.store
					.execute(
							"SELECT ?munuri WHERE {?munuri a <http://data.gemeindezukunft.ch/vocab/Municipality>;}",
							function(success, results) {
								// process the query results
								var curies = [];
								var curie;
								for ( var i = 0; i < results.length; i++) {
									curie = function() {
									};
									curie.municipalityUri = sko.rdf.prefixes
											.shrink(results[i].munuri.value);
									curies.push(curie);
								}

								viewModel.entries = ko.observableArray(curies);
								// apply binding to the result table
								sko.applyBindings("#results", viewModel);
								if(curies.length > 0){
									document.getElementById('results').style.display=''; 
									document.getElementById('noresults').style.display='none'; 
								} else {
									document.getElementById('results').style.display='none'; 
									document.getElementById('noresults').style.display=''; 
								}
							});
		}
	};
}

/**
 * Apply the semantic ko bindings for the search form
 */
function applyBindings() {
	sko.applyBindings("#form", resultViewModel);
	sko.applyBindings("#cantons", viewModel);
}

/**
 * Prototyping: overwrite toString method for beeing able to manipulate the
 * format of a date output
 * 
 * @returns {String} formatted date
 */
Date.prototype.toString = function() {
	return this.getDate() + "." + (this.getMonth() + 1) + "."
			+ this.getFullYear();
};

/**
 * Prototyping: add a new function to date: output a date in a string that can
 * be used to query against the server
 * 
 * @returns {String} formatted date
 */
Date.prototype.toAmericanString = function() {
	var datestring = "";
	datestring += this.getFullYear();
	if (Math.floor((this.getMonth()) / 10) == 0)
		datestring += "-0" + (this.getMonth());
	else
		datestring += "-" + (this.getMonth());

	if (Math.floor(this.getDate() / 10) == 0)
		datestring += "-0" + this.getDate();
	else
		datestring += "-" + this.getDate();
	return datestring;
};
