/* global rdf:false */

'use strict';

var
  fs = require('fs'),
  path = require('path'),
  express = require('express'),
  proxy = require('rdf-proxy-middleware');


var app = express()

app.use(proxy.forward('http://data.admin.ch/','http://localhost:8080/'))
app.use(function (req, res, next) {
    res.send('http://data.admin.ch/subject\n\
    http://data.admin.ch/predicate http://data.admin.ch/object.\n\
    \n')
})


var buildQuery = function (iri) {
  return 'define sql:describe-mode "CBD" DESCRIBE <' + iri + '>';
};

var buildExistsQuery = function (iri) {
  return 'ASK { <' + iri + '> ?p ?o }';
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
    path: '/query',
    options: {
      endpointUrl:'http://lindas-data.ch/sparql',
      queryOperation: 'urlencoded'
    }
  },
  sparqlSearch: {
    path: '/whatever',
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
