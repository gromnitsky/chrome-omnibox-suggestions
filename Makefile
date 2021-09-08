engine.type = $(shell egrep -m1 '^$(name)\s' engines.txt | awk '{print $$3}')
engine.attr = $(shell egrep -m1 '^$(name)\s[^\s]+\s$(type)\s?' engines.txt | awk '{print $$$1}')

name :=
type := $(engine.type)
keyword := $(call engine.attr,2)
type_desc := $(call engine.attr,4)



$(if $(name),,$(error `name` is empty, look in engines.txt))
$(if $(keyword),,$(error `keyword` is empty (`type` may be invalid)))

all: crx

out := _out/$(name)-$(type)-omnibox
mkdir = @mkdir -p $(dir $@)

f.src := $(wildcard src/*.js) $(wildcard src/*.html) \
	src/suggestions/$(name).js $(wildcard src/icons/$(name)*png)
f.dest := $(patsubst src/%, $(out)/%, $(f.src))

$(out)/%: src/%
	$(mkdir)
	cp $< $@

$(out)/manifest.json: src/manifest.erb.json
	$(mkdir)
	erb name=$(name) type=$(type) type_desc=$(type_desc) keyword=$(keyword) $< > $@

$(out)/rollup/deburr.js: node_modules/lodash.deburr/index.js
	node_modules/.bin/rollup -p @rollup/plugin-commonjs -m -i $< -o $@

compile.all := $(f.dest) $(out)/manifest.json $(out)/rollup/deburr.js
compile: $(compile.all)



pkg := $(out)-$(shell json version < src/manifest.erb.json)
pkg.key := $(out).pem
crx: $(pkg).crx

$(pkg).crx: $(pkg).zip $(pkg.key)
	crx3-new $(pkg.key) < $< > $@

$(pkg.key):
	$(mkdir)
	openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out $@

$(pkg).zip: $(compile.all)
	rm -f $@
	cd $(dir $<) && zip -qr $(CURDIR)/$@ *



.PHONY: test
test: $(compile.all)
	mocha -R list -u tdd $(t) test/test_*js
