const Character = require('src/domain/characters/entity/Character');
const Validator = require('src/domain/characters/validator/GetCharacterDetailsById');
const { ValidationError, NotFound } = require('src/domain/error/errors').types;

class GetCharacterDetailsById {
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
    const input = new Validator(data);

    const { valid, errors } = input.validate();
    if (!valid) {
      throw new this.helpers.ErrorBuilder(ValidationError, 'Validation Error', errors);
    }

    const { characterId } = input;

    let message;
    let meta;
    let resultData;

    // get from cache
    this.logger.info(`Fetching if request is cached.`);
    const cacheData = await this.RedisCaching.get(`character-id-${characterId}`);

    if (cacheData) { // if request is already cached return the cached data
      this.logger.info(`character-id-${characterId} cache found.`);
      resultData = JSON.parse(cacheData);
      message = 'Result from Cache.';
    } else { // if request is not yet cached, we fetch from marvel api and store to cache
      this.logger.info(`Fetching Character Details from Marvel API with characterId: ${characterId}.`);
      const response = await this.MarvelService.getCharacterById(characterId);

      this.logger.info(`Saving result to Cache.`);
      await this.RedisCaching.insertWithAbsoluteExpiry(
        `character-id-${characterId}`,
        JSON.stringify(response),
      );

      resultData = response;
      message = 'Result from Marvel API.';
    }

    this.logger.info(`Building Response Data.`);
    const { copyright, attributionText, attributionHTML, etag, data: responseData } = resultData;

    const { results: characters } = responseData;

    meta = {
      message,
      copyright,
      attributionText,
      attributionHTML,
      etag,
    };

    return {
      meta,
      data: new Character(characters[0]),
    };
  }
}

module.exports = GetCharacterDetailsById;
