require-selector
===

When writing JavaScript modules for use in an AMD project, often one needs access to the selector on the page. The issue is that we don't know whether jQuery or another JavaScript library is being used or not, and we aren't sure if the document.querySelectorAll function is up to scratch (say if we're in IE 7).

The require-selector module aims to resolve that by providing a common 'selector' global, we can assume basic CSS selector support through this global, irrespective of whether it is being provided by jQuery, another library, or the native support.

eg:

```javascript
require(['selector'], function($) {
  $('#some-element');
});
```

Installation
---

`volo add guybedford/selector`

(after `npm install volo -g`)

This will also download the require-is loader module dependency.

If not using volo, download require-selector and require-is into their folders in the main library folder. Then ensure that 'selector' is added in the requirejs map config to point to the file 'require-selector/main'.


How it works
---

When loaded, the first thing the require-selector module does is to check for native `querySelectorAll` support. If found, it will then run the following CSS tests to ensure that the native querySelector is good enough: 

* Attribute selectors
* Sibling selector
* Direct child selector

If not, the Sizzle selector engine is dynamically required from cdnjs at http://cdnjs.cloudflare.com/ajax/libs/sizzle/1.4.4/sizzle.min.js.

In this way, the selector is only required when absolutely necessary, reducing the necessary script size for most users.

*The conditional loading is dependent on the require-is conditional module.*

JavaScript Library Configuration
---

If using jQuery in a project, the above functionality would be entirely unnecessary. In this case, simply map the 'selector' global to 'jQuery' in the requirejs configuration:

```javascript
{
  map: {
    '*': {
      selector: 'jquery'
    }
  }
}
```

In this way, the require-selector module here is bypassed completely, made possible by the use of a commonly expected 'selector' global.

Footprint and benefits
---

The require-selector module, as well as all its dependencies (including the utility loader module require-is) come to 3KB minified, in contrast to the 14KB Sizzle selector engine.

The major beneift is the ability for libraries not to 'blindly' be dependent on jQuery purely for selector support and click events, allowing for the use of native development and shared code between libraries, freed from the common conceptual constraint of needing a selector engine solution.