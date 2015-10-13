
    /**
     * Loads dependencies for external functions.
     * 
     * Dependencies:
     * 
     *   - sgvizler.util
     *   - sgvizler.logger
     *   - sgvizler.registry
     *   - jQuery
     *   - google.load
     * 
     * @class sgvizler.loader
     * @static
     */
    S.loader = (function () {

        /*global $ */

        // Module dependencies:
        var util = S.util,
            logger = S.logger,
            registry = S.registry,
            moduleGooVis = registry.GVIZ,

            /** 
             * Contains a list of dependency loaders: function
             * name--deferred pairs. Keeps track of dependencies which
             * have already been asked for (but possibly not been
             * loaded yet).
             * 
             * @property loaders
             * @type Object
             * @private
             * @since 0.6.0
             **/
            loaders = {},

            /**
             * @method loadGScript
             * @private
             * @param {Array} [packages] List of
             * `google.visualization` packages to load.
             * @param {boolean} [loadLib] True if
             * `google.visualization` should be loaded even if
             * `packages` array is empty. This is needed in order to
             * load the `DataTable` class, which belongs to no
             * package.
             * @return {jQuery.Promise} Promise object which resolves
             * the loading of the given packages/library.
             * @since 0.6.0
             **/
            loadGScript = function (packages, loadLib) {
                /*global google */
                var loader,
                    promise = {},
                    packs = util.removeDuplicates(packages).sort(),
                    options;

                if (packs.length || loadLib) {
                    loader = $.Deferred();
                    options = {
                        callback: function () {
                            loader.resolve();
                            loaders[moduleGooVis].resolve(); // Always resolve google visualization loader.
                            logger.log("loadGScript: packages LOADED: " + packs);
                        }
                    };

                    if (packs.length) {
                        options.packages = packs;
                    }
                    google.load('visualization', '1', options);
                    logger.log("loadGScript: loading packages: " + packs);

                    promise = loader.promise();
                }

                return promise;
            },

            /**
             * Load the dependencies of all the given function
             * names---as specified in `sgvizler.registry`.
             * @method loadDependencies
             * @protected
             * @param {Array|string) A list of function names (or just
             * a single function name) to load dependencies for.
             * @return {jQuery.Promise} A promise object which
             * resolves the loading of all function dependencies.
             * @example loadDependencies('google.visualization.Map');
             *     returns deferred which will load the dependencies
             *     for the `google.visualization.Map` function as
             *     specified by `sgvizler.registry`.
             * @since 0.6.0
             **/
            loadDependencies = function (functions) {
                var i, ilen,
                    func,
                    deferreds = [], // Collect an array of deferreds.
                    gPacks = [],    // List of google packages to collect.
                    gLoader,
                    deps,
                    dep,
                    loadGLib;

                logger.log("loadDependencies: loading functions: " + functions);

                functions = util.removeDuplicates(util.toArray(functions));

                while (functions.length) {

                    func = functions.pop();
                    deps = registry.getDependencies(func);

                    for (dep in deps) {
                        if (deps.hasOwnProperty(dep)) {
                            // Dependency is already loaded/loading.
                            if (loaders[deps[dep]]) {
                                deferreds.push(loaders[deps[dep]]);
                            } else if (util.getObjectByPath(dep) === undefined) {
                                // If it is a googleViz function, then collect package in an array.
                                if (util.startsWith(dep, moduleGooVis)) {

                                    // Special handling of DataTable.
                                    if (dep === registry.DATATABLE) {
                                        loadGLib = true;
                                        loaders[deps[dep]] = $.Deferred();
                                    } else {
                                        gPacks.push(deps[dep]);
                                    }
                                } else {
                                    // Assume dependency is a link to a javascript.
                                    loaders[deps[dep]] = $.getScript(deps[dep]);
                                    deferreds.push(loaders[deps[dep]]);
                                    logger.log("loadDependencies: loading script: " + deps[dep]);
                                }
                            }
                        }
                    }
                }
                if (gPacks.length || loadGLib) {
                    gLoader = loadGScript(gPacks, loadGLib);
                    deferreds.push(gLoader);

                    // Register this gLoader with all input function
                    // dependencies solved by this loader.
                    for (i = 0, ilen = gPacks.length; i < ilen; i += 1) {
                        loaders[gPacks[i]] = gLoader;
                    }
                }
                // Sending array of arguments to when(). See http://bugs.jquery.com/ticket/8256.
                return $.when.apply($, deferreds);
            };

        /////////////////////////////////////////////////
        // PUBLICs

        return {
            loadDependencies: loadDependencies
        };
    }());
