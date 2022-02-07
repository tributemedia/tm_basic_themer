let Manifest = require('./Manifest.js');
let Theme = require('./Theme.js');
let IExtractCSSFromXD = require('./IExtractCSSFromXD.js');
let CSSRule = require('./CSSRule.js');
let CssGen = require('css-generator');

/**
 * Default implementation for Tribute Media's CSS extractor.
 * 
 * @param {Manifest} man The Manifest object
 * @param {Theme} theme The Theme object
 */
let TMDefaultExtractor = class extends IExtractCSSFromXD {
  constructor(man, theme) {
    super();

    if(man instanceof Manifest && theme instanceof Theme) {
      this.man = man;
      this.theme = theme;
      this.css = CssGen.create({indentation: '  '});
      this.cssRules = new Array();
    }
    else {
      console.error('Attempted to pass non Manifest or Theme objects into constructor. Aborting extraction.');
    }
  }

  /**
   * Implementing function from IExtractCSSFromXD
   * 
   * @returns {string} The CSS markup as a string
   */
  extract() {
    let self = this;

    this.theme.elements.forEach(function(element){
      let newRule = new CSSRule();
      let className = '';
      
      // All ellipse element are assumed to be color containers.
      if(element.hasOwnProperty('name') && element.name.startsWith('ellipse')) {
        let r = element.style.fill.color.value.r;
        let g = element.style.fill.color.value.g;
        let b = element.style.fill.color.value.b;
        className = element.name.replace('ellipse-', '');

        newRule.setDefinition('color', `rgb(${r},${g},${b})`);
      }
      // All other elements are assumed to be pixel value holders. Right now, only width and border-radius
      // are supported.
      else if(element.hasOwnProperty('name') && element.name.endsWith('value')) {
        var keyName = '';
        className = element.name.replace('-value', '');

        if(className.endsWith('width')) {
          keyName = 'width';
        }
        else if(className.endsWith('radius')) {
          keyName = 'border-radius';
        }

        if(keyName !== '') {
          newRule.setDefinition(keyName, `${element.text.rawText}`);
        }
        else {
          newRule.setRaw(element.text.rawText);
          newRule.setPriority(0);
          self.cssRules.push(newRule);
        }
      }

      // Remove any existing emdashes, and add the CSS Rule
      if(className !== '') {
        className = className.replace('\u2014', '');
        
        if(Object.keys(newRule.body).length > 0) {
          newRule.setClass(className);
          self.cssRules.push(newRule);
        }
      }
    });

    // Priority 0 rules are meant to go at the top of the CSS markup. This should be reserved for things like
    // import statements only that have to go at the top.
    this.cssRules.forEach(function(rule){
      if(rule.priority === 0 && rule.isRaw()) {
        self.css.addRaw(rule.raw);
      }
    });

    // For stylistic purposes, adding a couple newlines between top import statements and remaining content.
    self.css.addRaw('\n');
    self.css.addRaw('\n');
    
    this.cssRules.forEach(function(rule){
      if(rule.priority === 1) {
        self.css.addRule(rule.selector, rule.body);
      }
    });

    return this.css.getOutput();
  }
}

module.exports = TMDefaultExtractor;
