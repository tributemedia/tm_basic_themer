let AdmZip = require('adm-zip');

/**
 * XDFile wrapper class
 */
let XDFile = class {

  /**
   * XDFile, which is just a UTF-8 encoded ZIP.
   * @type {adm-zip}
   */
  file = {};

  /**
   * Loads the XD file from the resources folder.
   * @param {string} filename The name of the file, no extension. 
   */
  loadFile(filename){
    this.file = new AdmZip('./resources/' + filename + '.xd');
  }
}

module.exports = XDFile;