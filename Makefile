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

f.src := $(wildcard src/*.mjs) $(wildcard src/*.html) \
	src/suggestions/$(name).mjs $(wildcard src/icons/$(name)*png)
f.dest := $(patsubst src/%, $(out)/%, $(f.src))

$(out)/%: src/%
	$(mkdir)
	cp $< $@

$(out)/manifest.json: src/manifest.erb.json
	$(mkdir)
	erb name=$(name) type=$(type) type_desc=$(type_desc) keyword=$(keyword) $< > $@

compile := $(f.dest) $(out)/manifest.json
compile: $(compile)



pkg := $(out)-$(shell json version < src/manifest.erb.json)
crx: $(pkg).crx

$(pkg).zip: $(compile)
	cd $(dir $<) && zip -qr $(CURDIR)/$@ *

pkg.key := $(out).pem
%.crx: %.zip $(pkg.key)
	./zip2crx.sh $< $(pkg.key)

$(pkg.key):
	openssl genrsa 2048 > $@



upload:
	scp $(pkg).crx gromnitsky@web.sourceforge.net:/home/user-web/gromnitsky/htdocs/js/chrome/



.PHONY: test
test:
	mocha --require @babel/register -u tdd test/test_*mjs
