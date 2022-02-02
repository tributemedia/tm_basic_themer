var AdmZip = require('adm-zip');
var fs = require('fs');
var xd = new AdmZip('./resources/Narwhal-2021-v4.xd');
var CssGen = require('css-generator');
var css = CssGen.create({indentation: '  '});
var manifestEntry = xd.getEntry('manifest');
var manifestJSON = JSON.parse(manifestEntry.getData().toString('utf8'));
var manifestChildren = manifestJSON['children'][0]['children'];
var themeInfoJSON = '';
var cssRules = [];

manifestChildren.forEach(function(child){
  if(child.hasOwnProperty('name') && child.name == 'theme-default.css COLORS') {
    themeInfoJSON = child;
  }
});

if(themeInfoJSON != '' && Object.keys(themeInfoJSON).length > 0 ) {
  var path = 'artwork/' + themeInfoJSON.path + '/graphics/graphicContent.agc';
  var themeJSON = JSON.parse(xd.getEntry(path).getData().toString('utf8'));
  var themeChildren = themeJSON['children'][0]['artboard']['children'];
  
  themeChildren.forEach(function(child){
    var className = '';
    var cssRule = {};

    if(child.hasOwnProperty('name') && child.name.startsWith('ellipse')) {
      className = child.name.replace('ellipse-', '');
      var r = child.style.fill.color.value.r;
      var g = child.style.fill.color.value.g;
      var b = child.style.fill.color.value.b;

      cssRule = {
        color: `rgb(${r},${g},${b})`
      };
    }
    else if(child.hasOwnProperty('name') && child.name.endsWith('value')) {
      var keyName = '';
      className = child.name.replace('-value', '');

      if(className.endsWith('width')) {
        keyName = 'width';
      }
      else if(className.endsWith('radius')) {
        keyName = 'border-radius';
      }

      if(keyName !== '') {
        cssRule = {
          [keyName]: `${child.text.rawText}`
        };
      }
      else {
        //css.addRaw(`${child.text.rawText}`);
        cssRules.push({
          priority: 0,
          raw: child.text.rawText
        });
      }
    }

    if(className !== '') {
      className = '.' + className.replace('\u2014', '');

      if(Object.keys(cssRule).length > 0) {
        cssRules.push({
          priority: 1,
          rule: cssRule,
          className: className
        });
        //css.addRule(`.${className}`, cssRule);
      }
    }
  });
  //console.log(JSON.stringify(themeChildren, null, 2));
}

//console.log(css.getOutput());
//console.log(JSON.stringify(noCss, null, 2));
//console.log(noCss.length);
cssRules.forEach(function(rule){
  if(rule.priority === 0) {
    css.addRaw(rule.raw);
  }
});

css.addRaw('\n');
css.addRaw('\n');

cssRules.forEach(function(rule){
  if(rule.priority === 1) {
    css.addRule(rule.className, rule.rule);
  }
});

fs.writeFile('./output/output.css', css.getOutput(), function(err){
  if(err) {
    console.log('ERROR');
    console.log(err);  
  }
});
console.log('DONE!');
/*
fs = require('fs');
fs.writeFile('./output/output.txt', 'Hello World!', function(err){
  if(err) {
    console.log('ERROR');
    console.log(err);  
  }
});

console.log('Finished');

console.log(JSON.stringify(JSON.parse(entry.getData().toString('utf8')), 
      null, 
      5));
*/