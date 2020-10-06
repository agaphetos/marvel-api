const { attributes } = require('structure');

const Pagination = attributes({
  page: {
    type: Number,
    nullable: true,
    default: 1,
  },
  itemsPerPage: {
    type: Number,
    nullable: true,
    default: 100,
  },
})(
  class Pagination {
    // Add validation functions below
    // e.g.:
    //
    // isLegal() {
    //   return this.age >= User.MIN_LEGAL_AGE;
    // }
  },
);

module.exports = Pagination;
