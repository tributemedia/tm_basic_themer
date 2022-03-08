let Manifest = require('./Manifest.js');
let Theme = require('./Theme.js');
let IExtractCSSFromXD = require('./IExtractCSSFromXD.js');
let CSSRule = require('./CSSRule.js');
let CSSVariable = require('./CSSVariable.js');
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
      this.cssVars = new Array();
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
    let root = {};
    
    this.theme.elements.forEach(function(element){
      let varName = '';
      let value = '';
      
      // All ellipse elements are assumed to be color containers.
      if(element.hasOwnProperty('name') && element.name.startsWith('ellipse')) {
        
        let cssVar = new CSSVariable();
        varName = element.name.replace('ellipse-', '');
        varName = varName.replace('\u2014', '');

        if(element.style.fill.type != 'none') {

          let r = element.style.fill.color.value.r;
          let g = element.style.fill.color.value.g;
          let b = element.style.fill.color.value.b;
          value = `rgb(${r},${g},${b})`;

        }
        else {

          value = 'transparent';

        }

        cssVar.set(varName, value);
        self.cssVars.push(cssVar);
      }
      // All other elements are assumed to be pixel value holders. Right now, only width and border-radius
      // are supported.
      else if(element.hasOwnProperty('name') && element.name.endsWith('value')) {
        varName = element.name.replace('-value', '');

        if(varName.endsWith('width') || varName.endsWith('radius')) {
          let cssVar = new CSSVariable();

          value = `${element.text.rawText}`;
          varName = varName.replace('\u2014', '');
          cssVar.set(varName, value);
          self.cssVars.push(cssVar);
        }
        else {
          let newRule = new CSSRule();

          newRule.setRaw(element.text.rawText);
          newRule.setPriority(0);
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
    
    this.cssVars.forEach(function(cssVar){
      root[`${cssVar.getName()}`] = cssVar.getValue();
    });

    this.css.addRule(':root', root);
    
    return this.css.getOutput();
  }
}

module.exports = TMDefaultExtractor;
