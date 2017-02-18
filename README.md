[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][gemnasium-image]][gemnasium-url]

# detect-language

Finds the best matching language from Accept-Language header.

## Install

```sh
$ npm install --save detect-language
```

## Usage

```js
var app = require('express');

var locale = {
  supportedLanguages: ['de', 'fr', 'pl', 'en-GB', 'en-US'],
  defaultLanguage: 'en'
};

app.use(require('./src/i18n/detect-language')(locale));

// req.lang is set to detected language

```

## License

MIT © [Damian Krzeminski](https://pirxpilot.me)

[npm-image]: https://img.shields.io/npm/v/detect-language.svg
[npm-url]: https://npmjs.org/package/detect-language

[travis-url]: https://travis-ci.org/pirxpilot/detect-language
[travis-image]: https://img.shields.io/travis/pirxpilot/detect-language.svg

[gemnasium-image]: https://img.shields.io/gemnasium/pirxpilot/detect-language.svg
[gemnasium-url]: https://gemnasium.com/pirxpilot/detect-language
