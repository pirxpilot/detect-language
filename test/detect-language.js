const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const detectLanguage = require('../lib/detect-language');

function request(language) {
  return {
    get headers() {
      return { 'accept-language': language };
    }
  };
}

describe('detect-language node module', () => {
  it('match default', (_, done) => {
    const dl = detectLanguage({
      supportedLanguages: ['de', 'es'],
      defaultLanguage: 'en-US'
    });
    const req = request('fr;q=0.8,pl;q=0.6');
    dl(req, {}, () => {
      assert.equal(req.lang, 'en-US');
      assert.deepEqual(req.parsedLang, {
        language: 'en',
        value: 'en-US',
        region: 'US',
        q: -1
      });
      done();
    });
  });

  it('match exact', (_, done) => {
    const dl = detectLanguage({
      supportedLanguages: ['de', 'pl'],
      defaultLanguage: 'en-US'
    });
    const req = request('en-US,en;q=0.8,pl;q=0.6');
    dl(req, {}, () => {
      assert.equal(req.lang, 'en-US');
      assert.deepEqual(req.parsedLang, {
        language: 'en',
        value: 'en-US',
        region: 'US'
      });
      done();
    });
  });

  it('match on prefix', (_, done) => {
    const dl = detectLanguage({
      supportedLanguages: ['de', 'pl'],
      defaultLanguage: 'en-US'
    });
    const req = request('de-DE;q=0.8,pl;q=0.6');
    dl(req, {}, () => {
      assert.equal(req.lang, 'de');
      assert.deepEqual(req.parsedLang, {
        language: 'de',
        value: 'de',
        region: undefined
      });
      done();
    });
  });

  it('select best match if multiple alternatives found', (_, done) => {
    const dl = detectLanguage({
      supportedLanguages: ['pl', 'de', 'de-DE'],
      defaultLanguage: 'en-US'
    });
    const req = request('de-DE,de;q=0.8,pl;q=0.6');
    dl(req, {}, () => {
      assert.equal(req.lang, 'de-DE');
      assert.deepEqual(req.parsedLang, {
        language: 'de',
        value: 'de-DE',
        region: 'DE'
      });
      done();
    });
  });

  it('select prefix match if exact match does not exist', (_, done) => {
    const dl = detectLanguage({
      supportedLanguages: ['pl', 'de-DE'],
      defaultLanguage: 'en-US'
    });
    const req = request('de-AT,de;q=0.8,pl;q=0.6');
    dl(req, {}, () => {
      assert.equal(req.lang, 'de-DE');
      assert.deepEqual(req.parsedLang, {
        language: 'de',
        value: 'de-DE',
        region: 'DE'
      });
      done();
    });
  });
});
