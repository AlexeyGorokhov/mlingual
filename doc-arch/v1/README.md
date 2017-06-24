# mlingual

Create sets of textual files in different languages from templates

[![npm](https://img.shields.io/npm/l/express.svg?maxAge=2592000)]()
[![node](https://img.shields.io/node/v/gh-badges.svg?maxAge=2592000)](https://github.com/AlexeyGorokhov/mlingual)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

## Installation

```bash
$ npm install mlingual --save-dev
```

## Usage example

```js
const mlingual = require('mlingual');

mlingual('./src/html/', './src/dict', './bin/html', '$$')
.then(() => console.log('HTML files have been processed.'))
.catch(err => console.error(err));
```

## Workflow

### Dictionaries

Dictionary files might be organized in sub-directories. Sub-directory names become properties of the final dictionary object. E.g., given the following file structure of the dictionary folder,

```text
-- dict    <- Root directory
   |
   |-- homepage
   |   |
   |   |-- header.json
   |
   |-- global.json
```

abd content of the `header.json` file,

```json
{
  "greeting": {
    "en": "Hello",
    "de": "Hallo",
    "es": "Hola"
  },
  "greetingNext": {
    "en": "How are you?",
    "de": "Wie geht es dir?",
    "es": "¿Cómo estás?"
  }
}
```

and content of the `global.json` file,

```json
{
  "saveBtnLabel": {
    "en": "Save",
    "de": "Speichern",
    "es": "Guardar"
  },
  "cancelBtnLabel" : {
    "en": "Cancel",
    "de": "Stornieren",
    "es": "Cancelar"
  }
}
```

we'll get the following object for each language (e.g., `en`):

```javascript
{
  global: {
    saveBtnLabel: 'Save',
    cancelBtnLabel: 'Cancel'
  },
  homepage: {
    header: {
      greeting: 'Hello',
      greetingNext: 'How are you?'
    }
  }
}
```

__Notes__:

* In case a property doesn't contain the full set of language descriptors, the first descriptor is used instead.

### Templates

Create templates in any textual format with placeholders which are to be replaced with strings in different languages. E.g.,

```html
<p>$$homepage.header.greeting$$ $$homepage.header.greetingNext$$</p>
<button>$$global.saveBtnLabel$$</button>
<button>$$global.cancelBtnLabel$$</button>
```

The only restriction is that __between any two placeholders must be a space or a line break__.

## API Reference

`{Function} mlingual(srcFolder, dictFolder, destFolder, [delimiter])`

* `{String} srcFolder` - Absolute or relative to `process.cwd()` path to the folder containing templates.

* `{String} dictFolder` - Absolute or relative to `process.cwd()` path to the folder containing dictionaries.

* `{String} destFolder` - Absolute or relative to `process.cwd()` path to the destination folder.

* `{String} delimiter` - Optional. Placeholder delimiter symbol(s). Defaults to `$$`.

* Returns `{Promise<Void>}`.
