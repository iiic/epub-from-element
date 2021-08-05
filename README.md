# Epub from element v 0.2

**Creates ePub export for e-readers from selected html element(s)**
like html element (<code>article</code>, <code>div</code>, … , or whole <code>body</code> if you want)

Just vanilla javascript. Example style (.css) and html example, and server side endpoint example included in repo.

## What's new in version 0.2 ?
- script settings by json file
- automatically include images into ePub

## Use

Polyfill is in single javascript module file `epub-from-element.mjs`. And server side endpoint (example in PHP). Include it into your site like this:

``` html
<button id="print" disabled>Print article</button>
<button id="epub" title="Export into ePub format (for eReaders like Kindle, Kobo, Nook, …)" disabled>Export into ePub</button>
<dialog id="epub-response"></dialog>
<script type="text/json" id="epub-from-element-settings">
	{
		"modulesImportPath": "/modules",
		"exportElementQuerySelectors": [ "body" ],
		"ePubServerSideEndpoints": [ "/endpoint-example/php/index.php" ],
		"toggleEPubElementId": "epub",
		"togglePrintElementId": "print",
		"resultsElementId": "epub-response",
		"ePubTempPathPrefix": "https://domain.tld/epubs/",
		"serverSideHeaders": {
			"creator": "Me :)"
		},
		"texts": {
			"closeButtonTitle": "Close popup with ePub result"
		}
	}
</script>
<script type="module" src="/modules/dialogicPolyfill.mjs" crossorigin="anonymous" integrity="sha256-tcuKQ/zHdgYxhMhX4ouXfqnqtOMXek83f//3owjsOe0="></script>
<script type="module" src="/epub-from-element.mjs?v=0.2" crossorigin="anonymous" integrity="sha256-ZDlCa5wROr98OYWcaopb2heJ8WXQxW2tAtrPh/7K8lw="></script>
```

Server side example is in folder `endpoint-example/php` it's using `TPEpubCreator` library from *Luiz Otávio Miranda* ( Github repo : https://github.com/luizomf/php-epub-creator ) not included in this repo.

There's also `dialog` polyfill, because `dialog` element function it's currently not supported in Firefox. After time and incoming support you can delete script from origin `/modules/dialogicPolyfill.mjs`.

Other files like `example-usage.html` and `epub-from-element.css` are there to help, but they are not needed for script function.

Print function just simple release the browser's print dialog. And ePub button creates ePub request (POST data) and send it into server side endpoint (also part of this example). Endpoint creates ePub file, returns it into script and also store it into folder. So next times returns already created ePub from cache.

## Feature requests

- Currently in Chrome ePub file cannot be shared (it works with all picture formats, mp3, pdf… but not ePub). So share button must share link to file but not file itself :( . Maybe in future.
- Work without server side. This whole script can be maid only in frontend, so next times.

### Possible problems?

The mjs extension must have the correct mime type set to `text/javascript`, if it is too laborious, rename the suffix from `.mjs` to `.js`.

## Services

Unpkg: https://unpkg.com/epub-from-element

NPM: https://www.npmjs.com/package/epub-from-element

## Licence

**CC BY-SA 4.0**

This work is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/4.0/ or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.

-------

more info at https://iiic.dev/epub-from-element
