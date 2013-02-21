AMD Query
===

An AMD DOM utility plugin.

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

If not using volo, download amdquery and require-is into their folders in the main library folder. Then ensure that 'selector' is added in the requirejs map config to point to the file 'require-selector/main'.


Currently Supported Query Methods
---

Currently, the following query method libraries are supported:

[Bean](https://github.com/fat/bean) (bridge module)
  * Provides cross-platform event support such as `click` and `mousemove`.
  * Bridge library: https://github.com/guybedford/bean-amd (`volo add guybedford/bean-amd`)


[Bonzo](https://github.com/ded/bonzo) (bridge module)
  * Provides cross-platform DOM utilities such as `css`, `offset`, `attr`, `append`, `addClass`
  * Bridge library: https://github.com/guybedford/bonzo-amd (`volo add guybedford/bonzo-amd`)

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

Then provides a plugin API for loading selector-compatible modules for modular selector functionality
loaded with the syntax 'amdquery!moduleName'

For example, an event module can provide the click event method as:

click.js:
```javascript
define({
  click: function(els, callback) {
    els[0].addEventListener('click', callback);
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

The general format is that the selector functionality module is an object with methods,
each method taking the element array as its first argument.
 
To create or submit query methods, see the submission guidelines and examples page at
https://github.com/guybedford/AMD-query




Builds
------

When running a build with the r.js optimizer, only those selector features needed by the
layer get traced. Sizzle is always excluded from the build and downloaded dynamically on
older browsers, meaning the loading experience is modern browsers doesn't suffer due to
having to provide legacy support.

Uses the require-is module to conditionally load sizzle.


Footprint
---

The amdquery module on its own, without any query methods, as well as all its dependencies (including the utility loader module require-is) come to 3KB minified, in contrast to the 14KB Sizzle selector engine.

License
---

MIT
