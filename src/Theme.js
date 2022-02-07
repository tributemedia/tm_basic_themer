let XDFile = require('./XDFile.js');
let Manifest = require('./Manifest.js');

/**
 * Theme object, representing the theme-default COLORS artboard
 * @param {XDFile} xd The XDFile
 * @param {Manifest} manifest The Manifest
 */
let Theme = class{
  constructor(xd, manifest) {
    
    if(xd instanceof XDFile && manifest instanceof Manifest) {
      let themeInfoJSON = '';

      // Grab the path to the artboard from the manifest
      manifest.elements.forEach(function(element){
        if(element.hasOwnProperty('name') && element.name == 'theme-default.css COLORS') {
          themeInfoJSON = element;
        }
      });

      // Now that we know where the artboard is, load the data and elements
      if(themeInfoJSON != '' && Object.keys(themeInfoJSON).length > 0 ) {
        let path = 'artwork/' + themeInfoJSON.path + '/graphics/graphicContent.agc';

        this.data = JSON.parse(xd.file.getEntry(path).getData().toString('utf8'));
        this.elements = this.data['children'][0]['artboard']['children'];
      }
      else {
        console.error('Could not find the theme-default.css COLORS artboard.');
      }
    }
    else {
      console.error('Attempted to pass non XDFile object into constructor. Aborting Theme creation.');
    }
  }
}

module.exports = Theme;
