// =============================================================
// Variable Declarations
// =============================================================

"use strict";

var myStore;
var debug = false;
var skodebug = false;

// ---------------------------------------------------
// Main
// --------------------------------------------------

function init() {
	revalidate();				
}

// ------------------------------------------------
// Semantic Ko preparation
//-------------------------------------------------

function initGUI(graph,cb){
	if(debug)
		console.log("initializing GUI");
	myStore = rdfstore.create();
	myStore.insert(graph,function(success){		
		if(success){			
			if(skodebug){
				sko.activeDebug = true;
			}
			sko.ready(myStore,function(){
				if(debug){
					console.log("semantic ko ready");
					sko.store.execute("select * { ?s ?p ?o }",function(success, results){
            for(var i=0; i<results.length; i++) {
                var bindings = results[i];
                console.log(bindings.s.value+ " "+ bindings.p.value + " " + bindings.o.value + " . ");
            }
          });
				}
				cb();
			});			
		}
	});	
}


// --------------------------------------------------
// Callback Functions
// --------------------------------------------------


function dereference ( uri, cb) {

    //var me = this;
	var myStore = rdfstore.create();
		
    if (uri.match( /\:\/\//)) {
      // dereference by workplace service
      var uriService = uri;
      issueRequest( 'GET', uriService, null, function( success, status, data){
        //parseTriples( data, cb);
    	  myStore.load('text/turtle', data, function(success, results) {
  			if (success) {
  				if(debug)
  					console.log("successfully loaded %s triples!", results);
  				myStore.graph(function(success, graph) {
  					if (success) {
  						if(debug){
  							console.log("got the graph!");
              }
  			 			cb(graph);  			 		
			 		  }
  			  });
  				
  				
  				
  			} else {
  				console.log("Could not load triples!?");
  				cb(null);
  			}
  	
  		});	
      });
      
      
    }
    else
      // load local file
    	/*
      var data = this.loadLocalFile( uri, function( data) {
        parseTriples( data, cb);
      });
      */
     cb(null);
  }

function parseTriples( data, cb) {

    var me = this;

    rdfstore.create( function( store) {

      for (var prefix in me.prefixes) {
        store.rdf.setPrefix( prefix,  me.prefixes[ prefix]);
      };

      store.load( 'text/turtle', data, function( success, results) {
    	  
        store.graph( function( success, graph) {
          cb( graph);
        });
      });
    });

  }


function issueRequest2( method, uri, postData, cb) {
	 request
	   .post(uri)
	   .send(postData)
	   //.set('X-API-Key', 'foobar')
	   .set('Accept', 'text/turtle')
	   .set( 'Content-Type',   'text/turtle')
	   .end(function(res){
	     if (res.ok) {
	    	 cb( (request.status == 200), request.status, res);
	     } else {

		   console.log(res);
	       alert('Oh no! error ' + res.text);
	     }
	   });
}

function issueRequest( method, uri, postData, cb) {


    // take care for ime types
    // when HTML is desired, query turtle from server and
    // convert below after receiving that
    //var mimeTypeHtml = 'text/html';
    var requestMimeType = 'text/turtle';
    // var requestMimeType = 'application/json';

    // set scope of response callback to the restdemo object,
    // otherwise the scope would be the request object
    var callback_onResponse= onResponse.bind( this);

    // put the request
    var request = new XMLHttpRequest();
    request.open( method, uri, true);
    request.onreadystatechange = callback_onResponse;
    request.setRequestHeader( 'Accept',         requestMimeType);
    request.setRequestHeader( 'Connection',     'close');

    if ((postData) && (postData.length > 0)) {
      request.setRequestHeader( 'Content-Type',   'text/turtle');
      request.send( postData);
    } else
      request.send( null);

    function onResponse( ) {
      switch (request.readyState) {

        case 0:  // request object created
        case 1:  // request opened
        case 2:  // send method called, waiting for data
        case 3:  // data partially received
          break;

        case 4:
          var result;
          switch (request.status) {

            case 0:
              result = '<error>Error: Cannot reach Uduvudu service!</error>';
              break;

            case 200:
              result = request.responseText;
              break;

            case 501:
              result = '<error>Error: Function not implemented!</error>';
              break;

            default:
              result = '<error>HTTP error ' + request.status + ' - ' + request.statusText + '</error>';
              break;

          } // switch (request.status)

          // pass back result
          cb( (request.status == 200), request.status, result);

          break;  // case 4:

      } // switch (request.readyState)

    } // function onResponse

  return;

  }// 


