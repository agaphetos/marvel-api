const { attributes } = require('structure');

const GetCharacterDetailsById = attributes({
  characterId: {
    type: Number,
    required: true,
  },
})(class GetCharacterDetailsById {
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

module.exports = GetCharacterDetailsById;
