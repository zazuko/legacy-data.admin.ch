.PHONY:

##ROOT = ~/repo/sgvizler

UGLIFY = ~/bin/uglifyjs
##--jscomp_off externsValidation \--externs lib/raphael-dracula.pack.js \--externs lib/jquery.min.js
GCLOSURE = java -jar tool/google-closure/compiler.jar \
	--compilation_level SIMPLE_OPTIMIZATIONS \
	--js
MINIFIER = $(UGLIFY)
#MINIFIER = $(GCLOSURE)

XSLT = java -jar /usr/share/java/saxon.jar

##JSDOCROOT = tool/jsdoc2
##JSDOC = $ java -jar $(JSDOCROOT)/jsrun.jar $(JSDOCROOT)/app/run.js


JS_FILES = \
	sgvizler.js \
	lib/raphael-dracula.pack.js


## Dependencies
#  util.js:       [none]
#  namespace.js:  util
#  registry.js    util
#  logger.js      util
#  charts.js      util
#  datatables.js  util
#  parser.js:     namespace
#  loader.js      util, logger, registry
#  defaults.js    registry
#  Query.js       util, namespace, parser, loader, logger, option
#  container.js   util, loader, logger, Query
#  form.js        util, namespace, registry, loader, Query
sgvizler.pack.js: \
	src/start.js.part \
	src/core.js \
	src/util.js \
	src/namespace.js \
	src/registry.js \
	src/logger.js \
	src/charts.js \
	src/datatables.js \
	src/parser.js \
	src/loader.js \
	src/defaults.js \
	src/Query.js \
	src/container.js \
	src/form.js \
	sgvizler.visualization.pack.js \
	sgvizler.datatable.pack.js \
	src/end.js.part

sgvizler.visualization.pack.js: \
	src/visualization/start.js.part \
	$(wildcard src/visualization/*.js) \
	src/visualization/end.js.part

sgvizler.datatable.pack.js: \
	src/datatable/start.js.part \
	$(wildcard src/datatable/*.js) \
	src/datatable/end.js.part

sgvizler.js: sgvizler.pack.js Makefile
	cp -f $< $@

lib/raphael-dracula.pack.js: lib/raphael-1.3.1-min.js lib/dracula.js

%.pack.js:
	@rm -f $@
	cat $^ > $@
	@chmod a-w $@

%.min.js: %.js
	@rm -f $@
	$(MINIFIER) $< > $@

EXAMPLES = $(wildcard example/ex*.html)
SCREENSHOTS = $(addprefix screenshot/, $(addsuffix .png, $(notdir $(EXAMPLES))))

example: example/examples.xml example/examples.xsl
	cd example; $(XSLT) -s:examples.xml -xsl:examples.xsl
example/%.html: example


docs: yuidoc.json sgvizler.pack.js
	rm -fR $@/*
	yuidoc -o $@ -e '.part,.js' -t tool/yuidoc/theme -c $< src


## collect starts and ends to syntactically correct JS - for documentation.
# src/start+end.js: \
# 	src/start.js.part \
# 	src/end.js.part
#
# src/visualization/start+end.js: \
# 	src/visualization/start.js.part \
# 	src/visualization/end.js.part
#
# src/datatable/start+end.js: \
# 	src/datatable/start.js.part \
# 	src/datatable/end.js.part
#
# %start+end.js:
# 	@rm -f $@
# 	cat $^ > $@
# 	@chmod a-w $@
#
#jsdocs: jsdoc.conf src/start+end.js
#	rm -fR $@/*
#	$(JSDOC) -d=$@ -c=$< src/start+end.js
#	rm -f src/start+end.js


screenshot: $(SCREENSHOTS)
screenshot/%.html.png: example/%.html
	shutter --web http://localhost/sgvizler/trunk/$< -e -n --delay=5 -o $@
##import -window root -pause 3 -density 800 screen.png


clean:
	rm -f sgvizler*.js
	rm $(EXAMPLES)
	rm $(SCREENSHOTS)

all: \
	$(JS_FILES) \
	$(JS_FILES:.js=.min.js) \
	docs \
	example