const Pagination = require('src/domain/Pagination');
const { ValidationError } = require('src/domain/error/errors').types;

class ListCharacters {
  constructor({
    MarvelService,
    RedisCaching,
    logger,
    helpers,
  }) {
    this.MarvelService = MarvelService;
    this.RedisCaching = RedisCaching;
    this.logger = logger;
    this.helpers = helpers;
  }

  async execute(data) {
    this.logger.info(data);
    const pagination = new Pagination(data);

    const { valid, errors } = pagination.validate();
    if (!valid) {
      throw new this.helpers.ErrorBuilder(ValidationError, 'Validation Error', errors);
    }

    const { page, itemsPerPage } = pagination.toJSON();
    const offset = (page - 1) * itemsPerPage;

    let message;
    let meta;
    let resultData;

    // get from cache
    this.logger.info(`Fetching if request is cached.`);
    const cacheData = await this.RedisCaching.get(`characters-${page}-${itemsPerPage}`);

    if (cacheData) { // if request is already cached return the cached data
      this.logger.info(`characters-${page}-${itemsPerPage} cache found.`);
      resultData = JSON.parse(cacheData);
      message = 'Result from Cache.';
    } else { // if request is not yet cached, we fetch from marvel api and store to cache
      this.logger.info(`Fetching from Marvel API with params ${itemsPerPage, offset}.`);
      const response = await this.MarvelService.getCharacters(itemsPerPage, offset);

      this.logger.info(`Saving result to Cache.`);
      await this.RedisCaching.insert(
        `characters-${page}-${itemsPerPage}`,
        JSON.stringify(response),
      );

      resultData = response;
      message = 'Result from Marvel API.';
    }

    this.logger.info(`Building Response Data.`);
    const { copyright, attributionText, attributionHTML, etag, data: responseData } = resultData;
    const { total, count, results: characters } = responseData;
    const totalPage = Math.ceil(total / itemsPerPage);

    meta = {
      itemsPerPage,
      page,
      totalPage,
      hasNextPage: (page < totalPage),
      count,
      total,
      message,
      copyright,
      attributionText,
      attributionHTML,
      etag,
    };

    return {
      meta,
      data: characters.map(character => character.id),
    };
  }
}

module.exports = ListCharacters;
