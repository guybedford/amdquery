define(["module","./is-api"],function(e,t){var n={};return n.features=e.config()||{},n.features.browser=!1,n.features.build=!0,n.modules=null,n.lookup=function(e,t){if(n.features[e]!==undefined){t(n.features[e]);return}require([e]),t();return},n.normalize=t.normalize,n.load=function(e,r,i,s){if(!n.config){n.config=s;if(s.modules)for(var o=0;o<s.modules.length;o++)if(s.modules[o].layer===undefined){n.curModule=s.modules[o];break}}var u=t.parse(e);u.type=="lookup"&&n.lookup(u.feature,i),(u.type=="load_if"||u.type=="load_if_not")&&n.lookup(u.feature,function(e){var t=["~browser"];n.config.isExclude&&(t=t.concat(n.config.isExclude)),n.curModule&&n.curModule.isExclude&&(t=t.concat(n.curModule.isExclude)),t.indexOf(u.feature)!=-1&&(u.type=="load_if"?u.yesModuleId=null:u.noModuleId=null),t.indexOf("~"+u.feature)!=-1&&(u.type=="load_if"?u.noModuleId=null:u.yesModuleId=null),u.yesBuild||(u.yesModuleId=null),u.noBuild||(u.noModuleId=null),r([u.yesModuleId,u.noModuleId],i)})},n});