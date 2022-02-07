let XDFile = require('./src/XDFile.js');
let Manifest = require('./src/Manifest.js');
let Theme = require('./src/Theme.js');
let TMDefaultExtractor = require('./src/TMDefaultExtractor.js');
let fs = require('fs');
let prompt = require('prompt-sync')({sigint: true});
let packageJSON = require('./package.json');

let xd = new XDFile();

// Welcome and user input for filename
console.log('Welcome to the TM Basic Theming Automater!');
console.log(`v${packageJSON.version}`);
console.log('\n');
console.log('Please enter the name of your XD file (without extension).');
console.log('IMPORTANT: Make sure your file is in the resources folder!');
let filename = prompt();

// Extract CSS from XD using instance of IExtractCSSFromXD
console.log('Working, please wait.');
xd.loadFile(filename);
let man = new Manifest(xd);
let theme = new Theme(xd, man);
let extractor = new TMDefaultExtractor(man, theme);
let output = extractor.extract();

// Get output filename from user, write contents and exit.
console.log('Extraction complete! What do you want the output file name to be?');
let outFilename = prompt();

fs.writeFile(`./output/${outFilename}.css`, output, function(err){
  if(err) {
    console.log('There was a problem writing the output to file.');
    console.log(err);  
  }
  else {
    console.log('DONE! Check for your file in the output folder.');
  }
});
