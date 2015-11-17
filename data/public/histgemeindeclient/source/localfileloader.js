function LocalFileLoader() {

	// --------------------------------------------------
	// get URI of a local file - specify relative pathname only
	// --------------------------------------------------

	// ### TODO make sure the correct script element is read
	// ours does not need to be the last one !
	this.getURILocalFile = function(relFileName) {
		// determine directory of this script
		var scripts = document.getElementsByTagName('script');
		var scriptfullname = scripts[scripts.length - 1].src.split('?')[0]; // cut
		// off
		// any
		// URL
		// parms
		return scriptfullname.split('/').slice(0, -1).join('/') + '/'
				+ relFileName;
	};
	
	// --------------------------------------------------
	// load contents of a local file - specify relative pathname only
	// --------------------------------------------------

	this.loadLocalFile = function(relFileName) {
		var request = new XMLHttpRequest();
		request.open('GET', this.getURILocalFile(relFileName), false);
		request.send(null);
		return request.responseText;

	};
}

