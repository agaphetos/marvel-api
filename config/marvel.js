function loadMarvelAPIConfig() {
  const {
    MARVEL_API_BASE_URL,
    MARVEL_API_VERSION,
    MARVEL_API_PUBLIC_KEY,
    MARVEL_API_PRIVATE_KEY,
  } = process.env;

  if (
    MARVEL_API_BASE_URL
    && MARVEL_API_VERSION
    && MARVEL_API_PUBLIC_KEY
    && MARVEL_API_PRIVATE_KEY
  ) {
    const marvel = {};

    marvel.apiUrl = `${MARVEL_API_BASE_URL}/${MARVEL_API_VERSION}`;
    marvel.apiPublicKey = MARVEL_API_PUBLIC_KEY;
    marvel.apiPrivateKey = MARVEL_API_PRIVATE_KEY;

    return marvel;
  }

  return undefined;
}

module.exports = loadMarvelAPIConfig();
