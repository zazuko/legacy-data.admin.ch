(function(basic) {
  basic._basicGraph = basic.Graph;
  basic.Graph = function( context) {
    return Object.defineProperties( new basic._basicGraph( context) , {

      getSubjects: { writable: false, configurable : false, enumerable: true, value: function( property, value) {
        var result = [];
        this.match( null, property, value).forEach( function( triple) {
          result.push( triple.s.toString());
        });
        return result;
      }},

      getValues: { writable: false, configurable : false, enumerable: true, value: function( subject, property) {
        var result = [];
        this.match( subject, property, null).forEach( function( triple) {
          result.push( triple.o.toString());
        });
        return result;
      }},

      getFirstValue: { writable: false, configurable : false, enumerable: true, value: function( subject, property) {
        var result = this.getValues( subject, property);
        return result[ 0];
      }},

    }); // return Object.defineProperties( ...)

  }; // basic.Graph = function( context)

})(rdf);

