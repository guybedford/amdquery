/*
 * AMD Query
 *
 * An AMD DOM utility plugin.
 *
 * https://github.com/guybedford/amdquery
 *
 *
 * Cross-browser Selection
 * -----------------------
 *
 * Feature detects the native selector engine, loading Sizzle from CDN as a fallback only
 * when necessary.
 *
 * Feature detections are the attribute selector, attribute equals selector, direct child
 * and sibling selector support.
 *
 * When using the native selector, contextual selection of the form $('selector', context)
 * is fixed to work naturally instead of to the spec (http://ejohn.org/blog/thoughts-on-queryselectorall/).
 *
 * The selector also adds support to the native selector for the leading direct child selector within 
 * contextual selectors of the form: $('> child', context)
 *
 *
 * Pluggable Selector Functionality
 * --------------------------------
 *
 * Then provides a plugin API for loading selector-compatible modules for modular selector functionality
 * loaded with the syntax 'selecta!moduleName'
 *
 * For example, an event module can provide the $('div#myelement').click(function(){...})
 * functionality with a module of the form:
 *
 * click.js:
 * define({
 *   click: function(els, callback) {
 *     els[0].addEventListener('click', callback);
 *   }
 * });
 *
 * app.js:
 * define(['amdquery!click'], function($) {
 *   $('div#myelement').click(function(){...});
 * });
 * 
 * The general format is that the selector functionality module is an object with methods,
 * each method taking the element array as its first argument.
 *
 * To create or submit query methods, see the submission guidelines and examples page at
 * https://github.com/guybedford/amdquery
 *
 *
 * Builds
 * ------
 *
 * When running a build with the r.js optimizer, only those selector features needed by the
 * layer get traced. Sizzle is always excluded from the build and downloaded dynamically on
 * older browsers, meaning the loading experience is modern browsers doesn't suffer due to
 * having to provide legacy support.
 *
 * Uses the require-is module to conditionally load sizzle.
 *
 */
define(['is!~./native-selector?http://cdnjs.cloudflare.com/ajax/libs/sizzle/1.9.1/sizzle.min.js'], function(sizzle) {

  var uid = 'amd-selector-context';

  var select = function(selector, context) {
    if (sizzle)
      return sizzle(selector, context, selected);

    // if doing a contextual selector, create a temporary id on the contextual element
    // then run a global selector on that
    if (context) {
      if (context.id)
        selector = '#' + context.id + ' ' + selector;
      else {
        context.id = uid;
        selector = '#' + uid + ' ' + selector;
      }
    }

    var results = document.querySelectorAll(selector);

    // return the id if changed for context
    if (context && context.id == uid)
      context.id = '';

    for (var i = 0, len = results.length; i < len; i++)
      this[i] = results[i];

    this.length = results.length;
    
    return this;
  }

  // allow native selector into an array without any method bundle
  function amdquery(selector, context) {
    return select.call([], selector, context);
  }

  amdquery.normalize = function(name, normalize) {
    var names = name.split(',');
    for (var i = 0; i < names.length; i++)
      names[i] = normalize(names[i]);
    return names.join(',');
  }

  // store bundles of selector prototypes with different functionalities
  // prevents against namespace collisions for different library use together
  var selectorBundles = [
    // selector: function amdquery(){}
    // bundle: ['events', 'animations']
  ];

  amdquery.load = function(name, req, load, config) {
    var bundle = name.split(',');

    // check if we already have a bundle with this exact list of query method libs
    for (var i = 0; i < selectorBundles.length; i++) {
      var bundleMatch = true;
      
      for (var j = 0; j < selectorBundles[i].bundle.length; j++)
        if (bundle.indexOf(selectorBundles[i].bundles[j]) == -1) {
          bundleMatch = false;
          break;
        }

      for (var j = 0; j < bundle.length; j++)
        if (selectorBundles[i].bundle.indexOf(bundle[j]) == -1) {
          bundleMatch = false;
          break;
        }

      if (bundleMatch)
        return load(selectorBundles[i].selector);
    }

    // if not, create a new selector class for this bundle
    req(bundle, function() {
      var Selector = function(selector, context) {
        select.call(this, selector, context);
      }

      // named for consistency in function names
      // so that require('amdquery') looks identical to require('amdquery!click')
      function amdquery(selector, context) {
        return new Selector(selector, context);
      }

      // extend the base methods
      for (var i = 0; i < bundle.length; i++)
        for (var p in arguments[i])
          Selector[p] = arguments[i][p]

      Selector.prototype = new Array();

      // extend the prototype methods
      for (var i = 0; i < bundle.length; i++)
        if (arguments[i].prototype)
          for (var p in arguments[i].prototype)
            Selector.prototype[p] = arguments[i].prototype[p];

      // store the bundle
      selectorBundles.push({
        bundle: bundle,
        selector: amdquery
      });

      load(amdquery);
    });
  }

  return amdquery;
});
