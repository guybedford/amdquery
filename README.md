AMD Query
===

An AMD DOM utility plugin.

**No longer maintained, or advised for use.**

Conditionally polyfills the native selector engine, and is compatible with modular
query methods to provide DOM traversal, events, animations, etc.

Usage is of the form:

```javascript
require(['amdquery!events,animations'], function($) {
  $('#some-element').click(...);
});
```

Where `events` and `animations` are modular query methods.


Installation
---

`volo add guybedford/amdquery`

(after `npm install volo -g`)

This will also download the require-is loader module dependency.

When in an AMD project, Volo will automatically generate wrapper modules at `is.js` and `amdquery.js` for the folder files.

If not using Volo, download amdquery and require-is into their folders in the main library folder. 

Then ensure that `amdquery` and `is` are added in the requirejs map config:

```
{
  map: {
    '*': {
      is: 'require-is/is',
      amdquery: 'amdquery/amdquery'
    }
  }
}
```


Currently Supported Query Methods
---

Currently, the following query method libraries are supported:

[Bean](https://github.com/fat/bean) (bridge module)
  * Provides cross-platform event support such as `click` and `mousemove`.
  * Bridge library: https://github.com/guybedford/bean-amd (`volo add guybedford/bean-amd`)


[Bonzo](https://github.com/ded/bonzo) (bridge module)
  * Provides cross-platform DOM utilities such as `css`, `offset`, `attr`, `append`, `addClass`
  * Bridge library: https://github.com/guybedford/bonzo-amd (`volo add guybedford/bonzo-amd`)

[Morpheus](https://github.com/ded/morpheus) (bridge module)
  * Provides animations and tweens.
  * Bridge library: https://github.com/guybedford/morpheus-amd (`volo add guybedford/morpheus-amd`)

To submit a new query method module, submit a pull request.


Native Selector Polyfill
---

Feature detects the native selector engine, loading Sizzle from CDN as a fallback only
when necessary.

Feature detections are the attribute selector, attribute equals selector, direct child
and sibling selector support.

When using the native selector, contextual selection of the form $('selector', context)
is fixed to work naturally instead of to the spec (http://ejohn.org/blog/thoughts-on-queryselectorall/).

The selector also adds support to the native selector for the leading direct child selector within 
contextual selectors of the form: $('> child', context)


Pluggable Selector Functionality
--------------------------------

AMD Query provides a plugin API for loading selector-compatible modules for modular selector functionality
loaded with the syntax 'amdquery!moduleName'

For example, an event module can provide the click event method as:

click.js:
```javascript
define({
  prototype: {
    click: function(callback) {
      this[0].addEventListener('click', callback);
    }
  }
});
```

which can then be used with:

app.js:
```javascript
require(['amdquery!click'], function($) {
  $('#myel').click(function(){ /* etc */ });
});
```

Static methods can be provided outside of the `prototype` property with:

static.js
```javascript
define({
  ready: function() { /* ... */ }
});
```

which can be used as:

```javascript
require(['amdquery!static'], function($) {
  $.ready('...');
});
```

All combinations of query method bundles are generated uniquely to avoid namespace collissions.

This allows separate modules to define the same `click` method for example without clashing.


Builds
------

When running a build with the r.js optimizer, only those selector features needed by the
layer get traced. Sizzle is always excluded from the build and downloaded dynamically on
older browsers, meaning the loading experience is modern browsers doesn't suffer due to
having to provide legacy support.

Uses the require-is module to conditionally load sizzle.


Footprint
---

2.7KB minified and gzipped, in contrast to 33KB for jQuery.

So for example if you just need DOM events with Bean, only download 6.7KB instead of 33KB.

License
---

MIT
