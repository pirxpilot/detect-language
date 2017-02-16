var detectLanguage = require('../');

function request(language) {
  return {
    get: function get(header) {
      return (header === 'accept-language') && language;
    }
  };
}

describe('detect-language node module', function () {
  it('match default', function (done) {
    var dl = detectLanguage({
      supportedLanguages: ['de', 'es'],
      defaultLanguage: 'en-US'
    });
    var req = request('fr;q=0.8,pl;q=0.6');
    dl(req, {}, function() {
      req.should.have.property('lang', 'en-US');
      req.should.have.property('parsedLang', {
        language: 'en',
        value: 'en-US',
        region: 'US',
        q: -1
      });
      done();
    });
  });

  it('match exact', function (done) {
    var dl = detectLanguage({
      supportedLanguages: ['de', 'pl'],
      defaultLanguage: 'en-US'
    });
    var req = request('en-US,en;q=0.8,pl;q=0.6');
    dl(req, {}, function() {
      req.should.have.property('lang', 'en-US');
      req.should.have.property('parsedLang', {
        language: 'en',
        value: 'en-US',
        region: 'US'
      });
      done();
    });
  });

  it('match on prefix', function (done) {
    var dl = detectLanguage({
      supportedLanguages: ['de', 'pl'],
      defaultLanguage: 'en-US'
    });
    var req = request('de-DE;q=0.8,pl;q=0.6');
    dl(req, {}, function() {
      req.should.have.property('lang', 'de');
      req.should.have.property('parsedLang', {
        language: 'de',
        value: 'de',
        region: undefined
      });
      done();
    });
  });

  it('select best match if multiple alternatives found', function (done) {
    var dl = detectLanguage({
      supportedLanguages: ['pl', 'de', 'de-DE'],
      defaultLanguage: 'en-US'
    });
    var req = request('de-DE,de;q=0.8,pl;q=0.6');
    dl(req, {}, function() {
      req.should.have.property('lang', 'de-DE');
      req.should.have.property('parsedLang', {
        language: 'de',
        value: 'de-DE',
        region: 'DE'
      });
      done();
    });
  });

  it('select prefix match if exact match does not exist', function (done) {
    var dl = detectLanguage({
      supportedLanguages: ['pl', 'de-DE'],
      defaultLanguage: 'en-US'
    });
    var req = request('de-AT,de;q=0.8,pl;q=0.6');
    dl(req, {}, function() {
      req.should.have.property('lang', 'de-DE');
      req.should.have.property('parsedLang', {
        language: 'de',
        value: 'de-DE',
        region: 'DE'
      });
      done();
    });
  });
});
