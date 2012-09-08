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
  if (sizzle)
    return sizzle;
  else
    return function(selector, context) {
      return (context || document).querySelectorAll(selector);
    }
});
