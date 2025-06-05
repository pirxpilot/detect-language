// middleware that selects preferred language from the list of defaults

const debug = require('debug')('detect-language');

module.exports = detectLanguage;

// see: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.4
function findMatch(supportedLanguages, parsedAcceptLanguage) {
  for (const accepted of parsedAcceptLanguage) {
    let candidate;
    for (const supported of supportedLanguages) {
      if (supported.value === accepted.value) {
        return supported;
      }
      if (!candidate && supported.language === accepted.language) {
        candidate = supported;
      }
    }
    if (candidate) {
      return candidate;
    }
  }
}

function lang2obj(lang) {
  const [language, region] = lang.split('-');
  return {
    value: lang,
    language,
    region
  };
}

const parseAcceptLanguage = require('parse-accept-language');

function detectLanguage({ defaultLanguage, supportedLanguages }) {
  const supported = [defaultLanguage, ...supportedLanguages].map(lang2obj);

  // mark language the we select by default with low quality
  const defaultParsedLanguage = { ...supported[0], q: -1 };

  return function detectLanguage(req, _res, next) {
    if (req.lang) {
      debug('skip - language already detected:', req.lang);
      return next();
    }
    debug('started:', req.lang);
    const pal = parseAcceptLanguage(req);
    req.parsedLang = findMatch(supported, pal) || defaultParsedLanguage;
    req.lang = req.parsedLang.value;
    debug('detected:', req.lang);
    next();
  };
}
