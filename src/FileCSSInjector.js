let IInjectCSS = require('./IInjectCSS.js');
let fs = require('fs');
let fsExtra = require('fs-extra');
let prompt = require('prompt-sync')({sigint: true});
let cssparser = require('css');

/**
 * Implementor of the IInjectCSS interface. Takes CSS input as a string and
 * puts the CSS into a file based on the mode used.
 * 
 * @param {number} mode Mode of operation. See docs for more info.
 */
let FileCSSInjector = class extends IInjectCSS {

  /**
   * Determines operation performed with provided CSS. The modes supported are:
   * 
   * 1 - Creates (or overwrites) the CSS to a file of your choice in the output folder.
   * 2 - Replaces CSS values in the root selector in a targeted manner.
   */
  #mode;

  constructor(mode) {
    super();
    this.#mode = mode;

  }

  inject(css) {

    // Standard mode of operation. Overwrites prompted filename with CSS contents.
    if(this.#mode == 1) {
    
      // Get output filename from user, write contents and exit.
      console.log('Extraction complete! What do you want the output file name to be?');
      let outFilename = prompt();

      fs.writeFile(`./output/${outFilename}.css`, css, function(err){
        if(err) {
          console.log('There was a problem writing the output to file.');
          console.log(err);  
        }
        else {
          console.log('DONE! Check for your file in the output folder.');
        }
      });
    
    }
    // Reads CSS in destination file from work folder and injects CSS into it from
    // the passed in source CSS string
    else if(this.#mode == 2) {

      let dest = this.#removeImports(
        fs.readFileSync('./work/theme-default.css', {encoding: 'utf8', flag: 'r'}))
        .string;
      let sourceParsed = this.#removeImports(css);
      let sourceObj = cssparser.parse(sourceParsed.string);
      let sourceImports = sourceParsed.imports;
      let destObj = cssparser.parse(dest);
      let srcRootRule = {};
      let destRootRule = {};
      let destRuleIndex = 0;
      
      // Find the root selector in source.
      // The selector for root comes out a bit strange from the stringify, and
      // includes comments. Therefore, the includes check is necessary to find
      // the selector of :root
      sourceObj.stylesheet.rules.forEach(function(rule){

        if(rule.hasOwnProperty('selectors')) {
          rule.selectors.forEach(function(selector){
            if(selector.includes(':root')) {
              srcRootRule = rule;
            }
          });
        }
        
      });

      // Find the root selector in the destination
      destObj.stylesheet.rules.forEach(function(rule, index){

        if(rule.hasOwnProperty('selectors')) {
          rule.selectors.forEach(function(selector){
            if(selector.includes(':root')) {
              destRootRule = rule;
              destRuleIndex = index;
            }
          });
        }
      });

      // Inject values from source into destination
      srcRootRule.declarations.forEach(function(declaration){
        let propName = declaration.property;
        let val = declaration.value;

        destRootRule.declarations.forEach(function(destDec){

          if(destDec.property == propName) {
            destDec.value = val;
          }
        });
      });

      destObj.stylesheet.rules[destRuleIndex] = destRootRule;
      let output = '';
      let outputArr = cssparser.stringify(destObj).split('\n');

      // Add some whitespace to destination between imports and content
      outputArr.unshift('\n');
      outputArr.unshift('\n');

      // Add imports
      sourceImports.forEach(function(importLine){
        outputArr.unshift(importLine);
      });

      // Add each line of content with a newline
      outputArr.forEach(function(line){
        output += line + "\n";
      });
      
      // Write contents to destination file, and move from work folder to output
      fs.writeFile(`./work/theme-default.css`, output, function(err){
        if(err) {
          console.log('There was a problem writing the output to file.');
          console.log(err);  
        }
        else {
          fsExtra.move('./work/theme-default.css',
          './output/theme-default.css',
          function(moveErr){
            if(moveErr) {
              console.log('There was a problem writing the output to file.');
              onsole.log(err);  
            }
            else {
              console.log('DONE! Check for your file in the output folder.');
            }
          });
        }
      });
      
    }

  }

  /**
   * Removes import statements from the beginning of a string of CSS content.
   * 
   * @param {string} cssString 
   * @returns {object} Removed imports at 'imports' key, and new string at 'string'.
   */
  #removeImports(cssString) {

    let arr = cssString.split('\n');
    let newString = '';
    let imports = [];

    // Loop over the first line of CSS, remove if it's an import statement. If not,
    // break the loop and return.
    while(true) {
      if(arr[0].startsWith('@import')) {
        imports.push(arr.shift());
      }
      else {
        arr.forEach(function(line){
          newString += line + '\n';
        });
        break;
      }
    }

    return {
      'string': newString,
      'imports': imports
    };
  }

}

module.exports = FileCSSInjector;
