import test from 'node:test';
import detectLanguage from '../lib/detect-language.js';

function request(language) {
  return {
    get headers() {
      return { 'accept-language': language };
    }
  };
}

test('match default', (t, done) => {
  const dl = detectLanguage({
    supportedLanguages: ['de', 'es'],
    defaultLanguage: 'en-US'
  });
  const req = request('fr;q=0.8,pl;q=0.6');
  dl(req, {}, () => {
    t.assert.equal(req.lang, 'en-US');
    t.assert.deepEqual(req.parsedLang, {
      language: 'en',
      value: 'en-US',
      region: 'US',
      q: -1
    });
    done();
  });
});

test('match exact', (t, done) => {
  const dl = detectLanguage({
    supportedLanguages: ['de', 'pl'],
    defaultLanguage: 'en-US'
  });
  const req = request('en-US,en;q=0.8,pl;q=0.6');
  dl(req, {}, () => {
    t.assert.equal(req.lang, 'en-US');
    t.assert.deepEqual(req.parsedLang, {
      language: 'en',
      value: 'en-US',
      region: 'US'
    });
    done();
  });
});

test('match on prefix', (t, done) => {
  const dl = detectLanguage({
    supportedLanguages: ['de', 'pl'],
    defaultLanguage: 'en-US'
  });
  const req = request('de-DE;q=0.8,pl;q=0.6');
  dl(req, {}, () => {
    t.assert.equal(req.lang, 'de');
    t.assert.deepEqual(req.parsedLang, {
      language: 'de',
      value: 'de',
      region: undefined
    });
    done();
  });
});

test('select best match if multiple alternatives found', (t, done) => {
  const dl = detectLanguage({
    supportedLanguages: ['pl', 'de', 'de-DE'],
    defaultLanguage: 'en-US'
  });
  const req = request('de-DE,de;q=0.8,pl;q=0.6');
  dl(req, {}, () => {
    t.assert.equal(req.lang, 'de-DE');
    t.assert.deepEqual(req.parsedLang, {
      language: 'de',
      value: 'de-DE',
      region: 'DE'
    });
    done();
  });
});

test('select prefix match if exact match does not exist', (t, done) => {
  const dl = detectLanguage({
    supportedLanguages: ['pl', 'de-DE'],
    defaultLanguage: 'en-US'
  });
  const req = request('de-AT,de;q=0.8,pl;q=0.6');
  dl(req, {}, () => {
    t.assert.equal(req.lang, 'de-DE');
    t.assert.deepEqual(req.parsedLang, {
      language: 'de',
      value: 'de-DE',
      region: 'DE'
    });
    done();
  });
});

test('skip detection if req.lang is already set', (t, done) => {
  const dl = detectLanguage({
    supportedLanguages: ['de', 'pl'],
    defaultLanguage: 'en-US'
  });
  const req = request('de-DE;q=0.8,pl;q=0.6');
  req.lang = 'fr';
  dl(req, {}, () => {
    t.assert.equal(req.lang, 'fr');
    t.assert.equal(req.parsedLang, undefined);
    done();
  });
});

test('handle request with no accept-language header', (t, done) => {
  const dl = detectLanguage({
    supportedLanguages: ['de', 'pl'],
    defaultLanguage: 'en-US'
  });
  const req = {
    get headers() {
      return {};
    }
  };
  dl(req, {}, () => {
    t.assert.equal(req.lang, 'en-US');
    t.assert.deepEqual(req.parsedLang, {
      language: 'en',
      value: 'en-US',
      region: 'US',
      q: -1
    });
    done();
  });
});

test('handle language without region', (t, done) => {
  const dl = detectLanguage({
    supportedLanguages: ['de', 'pl'],
    defaultLanguage: 'en'
  });
  const req = request('en;q=0.9,pl;q=0.6');
  dl(req, {}, () => {
    t.assert.equal(req.lang, 'en');
    t.assert.deepEqual(req.parsedLang, {
      language: 'en',
      value: 'en',
      region: undefined
    });
    done();
  });
});
