/* global rdf:false */

'use strict';

var
  fs = require('fs'),
  path = require('path');


var buildQuery = function (iri) {
  return 'DESCRIBE <' + iri + '>';
};

var buildExistsQuery = function (iri) {
  return 'ASK { GRAPH <http://lindas-data.ch/resource/histgemeinde> { <' + iri + '> ?p ?o }}';
};

var patchResponseHeaders = function (res, headers) {
  if (res.statusCode === 200) {
    // clean existings values
    var fieldList = [
      'Access-Control-Allow-Origin',
      'Cache-Control',
      'Fuseki-Request-ID',
      'Server',
      'Vary'];

    if (res._headers) {
      fieldList.forEach(function (field) {
        if (field in res._headers) {
          delete res._headers[field];
        }

        if (field.toLowerCase() in res._headers) {
          delete res._headers[field.toLowerCase()];
        }
      });
    }

    // cors header
    headers['Access-Control-Allow-Origin'] = '*';

    // cache header
    headers['Cache-Control'] = 'public, max-age=120';

    // vary header
    headers['Vary'] = 'Accept';
  }

  return headers;
};

module.exports = {
  app: 'trifid-ld',
  logger: {
    level: 'debug'
  },
  listener: {
    port: 80
  },
  expressSettings: {
    'trust proxy': 'loopback',
    'x-powered-by': null
  },
  patchHeaders: {
    patchResponse: patchResponseHeaders
  },
  sparqlProxy: {
    path: '/raw/sparql',
    options: {
      endpointUrl:'http://lindas-data.ch/sparql',
      queryOperation: 'urlencoded'
    }
  },
  sparqlSearch: {
    path: '/query',
    options: {
      endpointUrl:'http://lindas-data.ch/sparql',
      resultsPerPage: 5,
      queryTemplate: fs.readFileSync(path.join(__dirname, 'data/sparql/search.sparql')).toString(),
      variables: {
        'q': {
          variable: '%searchstring%',
          required: true
        }
      }
    }
  },
  HandlerClass: require('./lib/sparql-handler'),
  handlerOptions: {
    endpointUrl: 'http://lindas-data.ch/sparql',
    buildQuery: buildQuery,
    buildExistsQuery: buildExistsQuery
  }
};
