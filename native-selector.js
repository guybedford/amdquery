/*
 * Selector Test
 *
 * Ensure that document.querySelectorAll works and supports all necessary selectors.
 *
 * Minimum requirements are:
 * -attribute selectors
 * -direct child selectors
 * -sibling selector
 *
 * CSS support plugin taken from
 * https://github.com/dperini/css-support/blob/master/src/css-support.js
 * 
 *
 */
define(['./css-support'], function(cssSupport) {
  //ensure we're in the browser
  if (typeof window === 'undefined')
    return true;
  
  if (!document.querySelectorAll)
    return false;
  
  var cssTests = [
    'E > F',
    'E + F',
    'E[foo]',
    'E[foo="bar"]'
  ];
  
  for (var i = 0; i < cssTests.length; i++)
    if (!cssSupport.supportSelector(cssTests[i]))
      return false;
  
  return true;
});
