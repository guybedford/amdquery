require-selector
---------------

Provides a loading and detection system for client-side css selectors through requirejs.

Usage:

```javascript
require(['selector'], function($) {
  $('');
});
```

Configuration:

```javascript
{
  config: {
    selectorModuleId: 'jQuery'
  }
}
```

Means that the given moduleId will be used to provide the selector instead.


If no selector is available, it reverts to `document.querySelectorAll`, performing necessary tests on this functionality.
If `document.querySelectorAll` doesn't exist or isn't up to scratch, it dynamically loads sizzle from a cdn.

The selector tests for document.querySelectorAll are specified with the plugin notation:

`'selector!attr'`

Returns a selector that allows attribute and attribute equals selectors.


`'selector!'Attr`

Returns a selector that allows attribute partial matches (all attribute selector support).

`'selector!child`

Returns a selector that supports child selectors

`'selector!not'`

Returns a selector that supports the 'not' keyword

etc.

http://tools.css3.info/selectors-test/test.html