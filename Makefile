name := urbandictionary
type := en
type_desc :=
keyword := u

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

%.crx: %.zip private.pem
	./zip2crx.sh $< private.pem

private.pem:
	openssl genrsa 2048 > $@



upload:
	scp $(pkg).crx gromnitsky@web.sourceforge.net:/home/user-web/gromnitsky/htdocs/js/chrome/



.PHONY: test
test:
	mocha --require @babel/register -u tdd test/*mjs
