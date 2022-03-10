let XDFile = require('./src/XDFile.js');
let Manifest = require('./src/Manifest.js');
let Theme = require('./src/Theme.js');
let TMDefaultExtractor = require('./src/TMDefaultExtractor.js');
let FileCSSInjector = require('./src/FileCSSInjector.js');
let fs = require('fs');
let prompt = require('prompt-sync')({sigint: true});
let packageJSON = require('./package.json');
let cssparser = require('css');

let xd = new XDFile();
let resourceFiles = [];
let filename = '';

// Load options for extraction
let tmpFiles = fs.readdirSync('./resources');

tmpFiles.forEach(function(file){

  if(file.endsWith('.xd')) {

    resourceFiles.push(file);

  }

});

// Welcome and user input for filename
console.log('Welcome to the TM Basic Theming Automater!');
console.log(`v${packageJSON.version}`);
console.log('\n');
while(true) {

  console.log('What file would you like to export?');
  resourceFiles.forEach(function(file, index){console.log(`${index + 1}) ${file}`);});
  let option = prompt();
  let valid = true;

  if(isNaN(option)) {

    valid = false;
    console.log('You entered an invalid number. Please enter only the number of the option ' + 
      'that corresponds with your choice. Press enter to try again.');
    prompt();

  }
  else {

    option = parseInt(option);
    if(option > resourceFiles.length || option <= 0) {

      valid = false;
      console.log('You entered a number that is not an option. Press enter to try again.');
      prompt();

    }
    else {

      filename = resourceFiles[option - 1];
      // 3 is used because that is the length of .xd ending, we want the filename without extension
      filename = filename.substring(0, filename.length - 3);

    }

  }

  if(valid) {

    break;

  }

}

// Extract CSS from XD using instance of IExtractCSSFromXD
console.log('Working, please wait.');
xd.loadFile(filename);
let man = new Manifest(xd);
let theme = new Theme(xd, man);
let extractor = new TMDefaultExtractor(man, theme);
let output = extractor.extract();
let injector = new FileCSSInjector(2);

injector.inject(output);
