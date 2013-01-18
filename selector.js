/*
 * Require-selector
 *
 * AMD selector module.
 *
 * Used as a fall-back selector module when jQuery or another CSS selector library isn't present.
 * (if one is, then simply add a paths config to map the 'selector' dependency to that instead)
 *
 * The selector module checks for document.querySelectorAll support, and then runs some basic tests
 * to ensure attribute selector, direct child and sibling selector support.
 *
 * If it fails, the Sizzle selector engine is dynamically downloaded from cdnjs.com
 * (http://cdnjs.cloudflare.com/ajax/libs/sizzle/1.4.4/sizzle.min.js). 
 * 
 * (source: http://caniuse.com/queryselector)
 *
 * Uses the require-is module to conditionally load sizzle
 *
 */
define(['is!~./native-selector?http://cdnjs.cloudflare.com/ajax/libs/sizzle/1.4.4/sizzle.min.js'], function(sizzle) {
  var wrappers = [];

  var selector = function(selector, context) {
    var selected;
    if (typeof selector != 'string')
      selected = selector;
    else
      selected = sizzle ? sizzle(selector, context) : (context || document).querySelectorAll(selector);
    
    for (var i = 0; i < wrappers.length; i++)
      if (typeof wrappers[i] == 'function')
        selected = wrappers[i](selected);
      else if (typeof wrappers[i] == 'object')
        for (var p in wrappers[i]) {
          var curFunc = wrappers[i][p];
          if (typeof curFunc == 'function')
            selected[p] = function() {
              Array.prototype.splice.call(arguments, 0, 0, this);
              curFunc.apply(this, arguments);
            }
        }
    
    return selected;
  }

  selector.addWrapper = function(wrapper) {
    if (wrapper.setSelectorEngine)
      wrapper.setSelectorEngine(selector);
    if (wrapper.setQueryEngine)
      wrapper.setQueryEngine(selector);
    if (wrappers.indexOf(wrapper) == -1)
      wrappers.push(wrapper);
  }
  
  selector.normalize = function(name, normalize) {
    var names = name.split(',');
    for (var i = 0; i < names.length; i++)
      names[i] = normalize(names[i]);
    return names.join(',');
  }
  selector.load = function(name, req, load, config) {
    var names = name.split(',');
    req(names, function() {
      for (var i = 0; i < arguments.length; i++) {
        var wrapper = arguments[i];
        if (!wrapper)
          continue;
        selector.addWrapper(wrapper);
      }
      load(selector);
    });
  }
  return selector;
});
