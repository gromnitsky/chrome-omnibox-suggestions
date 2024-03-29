# Chrome omnibox suggestions

A collection of search suggestion 'engines' for different websites
(for the time being it's imdb, wikipedia, ldoce & urbandictionary).

![omnibar](screenshot.png)

Each 'engine' has a type & a unique keyword. Chrome doesn't allow us
to register multiple omnibox keywords for a single extension, thus if
we want to have search suggestions, say, for the English wikipedia &
for the Ukrainian wikipedia, we need to *generate* 2 separate
extensions.

See `engines.txt` for the full list of extensions you can make.

## Generation

You'll need Ruby, GNU make &

    # npm -g i json crx3-utils

To create an extension for the English wikipedia:

    $ make name=wikipedia type=en

The resulting .crx should appear in `_out` dir.

If you don't like the default keyword:

    $ make name=wikipedia type=en keyword=w

## How to use a .crx in Windows

Unpack the file to some dir, e.g.,
`$HOMEPATH/Documents/crx/urbandictionary-nsfw-omnibox`, in Chrome's
extension page turn on 'Developer mode', then click 'Load unpacked' &
select the dir.

## Bugs

* The debounce wait time is hardcoded to 250ms;

## License

MIT.
