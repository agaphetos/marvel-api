const { attributes } = require('structure');

const Character = attributes({
  id: Number,
  name: String,
  description: String,
})(class Character {
  // Add validation functions below
  // e.g.:
  //
  // isLegal() {
  //   return this.age >= User.MIN_LEGAL_AGE;
  // }
});

// Add constants below
// e.g.:
//
// User.MIN_LEGAL_AGE = 21;

module.exports = Character;
