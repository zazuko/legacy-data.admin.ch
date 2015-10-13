
        /** 
         * Utility functions for chart functions.
         * 
         * .visualization
         * @class sgvizler.visualization.util
         * @static
         */

        C.util = (function () {
            var

                linkify = function (url, arraySyntax) {
                    var prefixed = namespace.prefixify(url),
                        link;
                    if (prefixed !== url) {
                        // Returns a link according to the format used by
                        // sgvizler.util.createHTMLElement.
                        if (arraySyntax) {
                            link = ['a', { href: url }, prefixed];
                        } else { // straight html
                            link = '<a href=' + url + '>' +  prefixed + '</a>';
                        }
                    } else {
                        link = url;
                    }
                    return link;
                },
                cssloaded = false;

            return {

                /** 
                 * Converts a url into a <a href=""> element with the
                 * link prefixified. Returns a string.
                 * @method linkify2String
                 * @protected
                 * @param {String} url The url to linkify.
                 * @return {String}
                 */
                linkify2String: function (url) {
                    return linkify(url, false);
                },
                /** 
                 * Converts a url into a `<a href="url">link</a>` element with the
                 * link prefixified. Returns an array on the format
                 * described in `sgvizler.util.createHTMLElement`.
                 * @method linkify2String
                 * @protected
                 * @param {String} url The url to linkify.
                 * @return {Array}
                 */
                linkify2HTMLElementArray: function (url) {
                    return linkify(url, true);
                },

                /** 
                 * Loads the css file `sgvizler.charts.css`.
                 * @method loadCSS
                 * @protected
                 * @injects
                 */
                loadCSS: function () {
                    if (!cssloaded) {
                        $('head').append('<link rel="stylesheet" href="' + S.core.VERSIONFOLDER + 'sgvizler.charts.css" type="text/css" />');
                        cssloaded = true;
                    }
                }
            };
        }());
