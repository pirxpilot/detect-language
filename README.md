[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

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

[npm-image]: https://img.shields.io/npm/v/detect-language
[npm-url]: https://npmjs.org/package/detect-language

[build-url]: https://github.com/pirxpilot/detect-language/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/actions/workflow/status/pirxpilot/detect-language/check.yaml?branch=main

[deps-image]: https://img.shields.io/librariesio/release/npm/detect-language
[deps-url]: https://libraries.io/npm/detect-language

