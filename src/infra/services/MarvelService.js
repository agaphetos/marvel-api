const crypto = require('crypto');
const querystring = require('querystring');

const { NotFoundError } = require('src/domain/error/errors').types;

class MarvelService {
  constructor({
    config,
    utils,
    helpers,
    logger,
  }) {
    this.utils = utils;
    this.helpers = helpers;
    this.logger = logger;
    this.apiUrl = config.marvel.apiUrl;
    this.apiPublicKey = config.marvel.apiPublicKey;
    this.apiPrivateKey = config.marvel.apiPrivateKey;
  }

  generateHash(ts) {
    return crypto.createHash('md5').update(`${ts}${this.apiPrivateKey}${this.apiPublicKey}`).digest('hex');
  }

  async getCharacters(limit = 100, offset = 0) {
    const path = 'public/characters';
    const ts = Date.now();
    const hash = this.generateHash(ts);

    const queryParams = querystring.stringify({
      ts,
      apikey: this.apiPublicKey,
      hash,
      limit,
      offset,
    });

    const result = await this.utils.httpsPromise.get(`${this.apiUrl}/${path}?${queryParams}`);
    const { body } = result;

    return body;
  }

  async getCharacterById(characterId) {
    try {
      const path = 'public/characters';
      const ts = Date.now();
      const hash = this.generateHash(ts);

      const queryParams = querystring.stringify({
        ts,
        apikey: this.apiPublicKey,
        hash,
      });

      const result = await this.utils.httpsPromise.get(`${this.apiUrl}/${path}/${characterId}?${queryParams}`);
      const { body } = result;

      return body;
    } catch (error) {
      this.logger.error(error);

      throw new this.helpers.ErrorBuilder(NotFoundError, 'Resource Not Found.', error);
    }
  }
}

module.exports = MarvelService;