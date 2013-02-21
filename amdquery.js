/*
 * AMD Query
 *
 * An AMD DOM utility plugin / modular jQuery AMD replacement.
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
 * The general format is that the selector functionality module is an object with methods,
 * each method taking the element array as its first argument.
 *
 * To create or submit query methods, see the submission guidelines and examples page at
 * https://github.com/guybedford/AMD-query
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

  // generate the selector constructor to use for instances
  var selectorClass = function amdquery(){}
  var selectorProto = new Array();
  selectorClass.prototype = selectorProto;

  var selector = function(selector, context) {
    var selected = new selectorClass();

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
      selected[i] = results[i];
    
    return selected;
  }

  selector.addMethods = function(methodObj) {
    for (var methodName in methodObj) {
      var method = methodObj[methodName];
      selectorProto[methodName] = function() {
        // add els array as the first argument
        var args = Array.prototype.splice.call(arguments, 0);
        args.unshift(this);
        return method.apply(this, args);
      }
    }
  }
  
  selector.normalize = function(name, normalize) {
    var names = name.split(',');
    for (var i = 0; i < names.length; i++)
      names[i] = normalize(names[i]);
    return names.join(',');
  }

  var added = [];
  selector.load = function(name, req, load, config) {
    var names = name.split(',');
    
    // track and remove names already added
    for (var i = 0; i < names.length; i++)
      if (added.indexOf(names[i]) != -1)
        names.splice(i--, 1);
      else
        added.push(names[i]);

    req(names, function() {
      for (var i = 0; i < arguments.length; i++) {
        var methodObj = arguments[i];
        if (!methodObj)
          continue;
        selector.addMethods(methodObj);
      }
      load(selector);
    });
  }
  return selector;
});
