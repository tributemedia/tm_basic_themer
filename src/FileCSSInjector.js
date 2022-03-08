let IInjectCSS = require('./IInjectCSS.js');
let fs = require('fs');
let prompt = require('prompt-sync')({sigint: true});

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

  }

}

module.exports = FileCSSInjector;
