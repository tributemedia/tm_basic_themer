/**
 * Represents a variable in CSS.
 */
let CSSVariable = class {

  /**
   * Name of the variable.
   * 
   * @type {string}
   */
  #name;

  /**
   * The value of the variable.
   * 
   * @type {string}
   */
  #value;

  /**
   * The entire CSS variable declaration as a string.
   * 
   * @type {string}
   */
  #export;

  constructor() {
    this.#name = '';
    this.#value = '';
    this.#export = '';
  }

  getName() {
    return this.#name;
  }

  getValue() {
    return this.#value;
  }

  /**
   * Sets the name and value of the variable, along with the export string.
   * 
   * @param {string} name The name of the variable
   * @param {string} value The value of the variable
   */
  set(name, value) {
    this.#name = `--${name}`;
    this.#value = value;
    this.#export = `${this.#name}: ${this.#value}; \n`;
  }

  /**
   * Returns the variable CSS declaration as a string.
   * 
   * @returns {string}
   */
  toString() {
    return this.#export;
  }
}

module.exports = CSSVariable;