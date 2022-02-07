let XDFile = require('./XDFile.js');

/**
 * The manifest located within the XDFile that contains project information.
 * 
 * @param {XDFile} xd The XDFile
 */
let Manifest = class {
  constructor(xd){
    if(xd instanceof XDFile) {
      let manifestEntry = xd.file.getEntry('manifest');

      this.data = JSON.parse(manifestEntry.getData().toString('utf8'));
      this.elements = this.data['children'][0]['children'];
    }
    else {
      console.error('Attempted to pass non XDFile object into constructor. Aborting Manifest creation.');
    }
  }
}

module.exports = Manifest;