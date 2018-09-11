out := _out
pkg.name := $(shell json -e 'this.q = this.name + "-" + this.version' q < src/manifest.json)

mkdir = @mkdir -p $(dir $@)
src := $(shell find src -type f)

crx: $(out)/$(pkg.name).crx

$(out)/$(pkg.name).zip: $(src)
	$(mkdir)
	cd $(dir $<) && zip -qr $(CURDIR)/$@ *

%.crx: %.zip private.pem
	./zip2crx.sh $< private.pem

private.pem:
	openssl genrsa 2048 > $@



upload:
	scp $(out)/$(pkg.name).crx gromnitsky@web.sourceforge.net:/home/user-web/gromnitsky/htdocs/js/chrome/



.PHONY: test
test:
	mocha --require @babel/register -u tdd test/*mjs
