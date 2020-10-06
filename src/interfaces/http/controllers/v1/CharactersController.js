const { Router } = require('express');

const BaseController = require('./BaseController');

class CharactersController extends BaseController {
  constructor() {
    super();
    const router = Router();
    router.get('/', this.injector('ListCharacters'), this.getWithQuery);
    router.get('/:characterId', this.injector('GetCharacterDetailsById'), this.getWithQuery);

    return router;
  }
}

module.exports = CharactersController;
