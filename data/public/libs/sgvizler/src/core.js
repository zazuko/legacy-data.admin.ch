
    /**
     * Holds central constants.
     * 
     * @class sgvizler.core
     */

    S.core = (function () {

        // global public constants
        var

            /**
             * The version number of this sgvizler.
             * @property {string} VERSION
             * @final
             * @public
             * @for sgvizler
             * @since 0.6.0
             **/
            VERSION = "0.6.0",

            /**
             * sgvizler's homepage.
             * @property {string} HOMEPAGE
             * @final
             * @public
             * @for sgvizler
             * @since 0.6.0
             **/
            HOMEPAGE = "http://sgvizler.googlecode.com",

            // global private constants
            HOMEFOLDER = HOMEPAGE + "/svn/",
            //versionfolder = homefolder + "release/" + release + "/", // TODO
            VERSIONFOLDER = "http://localhost/sgvizler/trunk/";

        return {
            VERSION: VERSION,
            HOMEPAGE: HOMEPAGE,
            HOMEFOLDER: HOMEFOLDER,
            VERSIONFOLDER: VERSIONFOLDER
        };
    }());
