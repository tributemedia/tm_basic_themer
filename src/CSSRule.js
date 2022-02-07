
/**
 * An object for representing information about a CSS rule to be used in a css-generator
 */
let CSSRule = class {

  /**
   * The CSS selector for this rule.
   * 
   * @type {string}
   */
  #selector;

  /**
   * Priority indicating the order in which this rule should be added.
   * 
   * @type {number}
   */
  #priority;

  /**
   * Raw text to be added to a CSS generator.
   * 
   * @type {string}
   */
  #raw;

  /**
   * The rule definition.
   * 
   * @type {{key: string, value: string|number}}
   */
  #body;

  constructor(){
    this.#selector = '';
    this.#priority = 1;
    this.#body = {};
    this.#raw = '';
  }

  // Getters

  get selector() {
    return this.#selector;
  }

  get priority() {
    return this.#priority;
  }

  get body() {
    return this.#body;
  }

  get raw() {
    return this.#raw;
  }

  /**
   * Returns a value indicating whether this CSS contains raw text or not.
   * 
   * @returns {boolean}
   */
  isRaw() {
    return this.#raw !== '';
  }

  /**
   * Sets the name of the class for this CSS rule.
   * 
   * @param {string} name The name of the class to be set as the selector for this rule, no period necessary.
   */
  setClass(name) {
    this.#selector = `.${name}`;
  }

  /**
   * Sets the rule definition.
   * 
   * @param {string} key The property to target for the CSS rule.
   * @param {string|number} val The value of the property
   */
  setDefinition(key, val) {
    this.#body[key] = val;
  }

  /**
   * Sets the numerical priority of being added to a css-generator.
   * 
   * @param {number} priority The numerical order of priority for being added to a css-generator 
   */
  setPriority(priority) {
    this.#priority = priority;
  }

  /**
   * The raw text to be added to a css-generator. This would be used when adding imports, for example.
   * 
   * @param {string} raw Raw string value to be added to css-generator 
   */
  setRaw(raw) {
    this.#raw = raw;
  }
}

module.exports = CSSRule;
