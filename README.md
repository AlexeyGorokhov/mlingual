# mlingual

An opinionated build tool for making apps multilingual

[![npm](https://img.shields.io/npm/l/express.svg?maxAge=2592000)]()

mlingual offers a highly opinionated way of making apps multilingual. It rests on the following basic ideas:

1. There must be only one variant of codebase in VCS. All the multilinguality must appear on the build phase. mlingual is a utility which might be used with any build tool supporting javascript.

2. Dictionaries should be maintainable separately from the app codebase. As a developer, you only build the structure of a dictionary, then pass it to a professional translator.

3. Dictionary entries are grouped by there keys. Each key includes all the languages you are to support. This makes maintenance easier.

  ```json
  {
    "title": {
      "en": "Welcome to our website",
      "de": "Willkommen auf unserer Webseite",
      "es": "Bienvenido a nuestro sitio web"
    },
    "helloMessage": {
      "en": "Hello, everybody!",
      "de": "Hallo, alle zusammen!",
      "es": "¡Hola todos!"
    }
  }
  ```

4. There should be a way of progressive translation with default language option. In the following example, Spanish translation of the `helloMessage` key will default to the first language option `en`:

  ```json
  {
    "title": {
      "en": "Welcome to our website",
      "de": "Willkommen auf unserer Webseite",
      "es": "Bienvenido a nuestro sitio web"
    },
    "helloMessage": {
      "en": "Hello, everybody!",
      "de": "Hallo, alle zusammen!"
    }
  }
  ```

5. Dictionaries should be maintained in a friendly folder hierarchy. Like this:

  ```
  -- dict
     |
     |-- pages
     |   |-- blog
     |   |   |
     |   |   |-- post1.json
     |   |   |-- post2.json
     |   |
     |   |-- header.json
     |   |-- footer.json
     |   
     |
     |-- global.json
  ```

  Then in you templates, you reference dictionary entries like this:

  ```
  $$pages.header.helloMessage$$
  $$pages.blog.post2.title$$
  $$global.userNameLabel$$
  ```


## Installation

```bash
$ npm install --save-dev mlingual
```


## Usage Scenarios

In all examples below, we assume your dictionaries have two languages: `en` and `de`, and the structure of your source dictionary folder is as shown above.

### Dictionaries

#### Basic output format

```js
const mlingual = require('mlingual');

await mlingual({
  dict: {
    src: './src/dict',
    dest: './public/dict'
  }
});
```

This will produce the following output folder structure:

```
-- public/dict
   |
   |-- pages
   |   |
   |   |-- blog
   |   |   |
   |   |   |-- en
   |   |   |   |
   |   |   |   |-- post1.json
   |   |   |   |-- post2.json
   |   |   |
   |   |   |-- de
   |   |       |
   |   |       |-- post1.json
   |   |       |-- post2.json
   |   |
   |   |--en
   |   |  |
   |   |  |-- header.json
   |   |  |-- footer.json
   |   |
   |   |--de
   |      |
   |      |-- header.json
   |      |-- footer.json
   |   
   |--en
   |  |
   |  |--global.json
   |
   |--de
      |
      |--global.json

```

#### Flat output format

```js
const mlingual = require('mlingual');

await mlingual({
  dict: {
    src: './src/dict',
    dest: './public/dict',
    isFlat: true
  }
});
```

This will produce the following output folder structure:

```
-- public/dict
   |
   |-- pages.blog.post1.en.json
   |-- pages.blog.post1.de.json
   |-- pages.blog.post2.en.json
   |-- pages.blog.post2.de.json
   |-- pages.header.en.json
   |-- pages.header.de.json
   |-- pages.footer.en.json
   |-- pages.footer.de.json
   |-- global.en.json
   |-- global.de.json
```

#### Dictionary Output Summary

```js
const mlingual = require('mlingual');

await mlingual({
  dict: {
    src: './src/dict',
    dest: './public/dict',
    summaryDest: './build/dict-summary'
  }
});
```

Then a JSON file containing an array of names of all output dictionary files will be put in the `./build/dict-summary` folder. The file names contain paths relative to `./public/dict`.

This might be useful for cache-busting dictionary files with hashes.


### Processing templates

Create templates in any textual format with placeholders which are to be replaced with strings in different languages. E.g.,

```html
<p>$$homepage.header.greeting$$ $$homepage.header.greetingNext$$</p>
<button>$$global.saveBtnLabel$$</button>
<button>$$global.cancelBtnLabel$$</button>
```

The only restriction is that __between any two placeholders must be a space or a line break__.

Examples below assume the following structure of the folder with templates:

```
-- src/html
   |
   |-- pages
   |   |-- blog
   |   |   |
   |   |   |-- post1.html
   |   |   |-- post2.html
   |   |
   |   |-- signup.html
   |
   |-- index.html
```

#### Basic output format

```js
const mlingual = require('mlingual');

await mlingual({
  dict: {
    src: './src/dict'
  },
  template: {
    src: './src/html',
    dest: './public/html'
  }
});
```

This will produce the following output folder structure:

```
-- public/html
   |
   |-- pages
   |   |-- blog
   |   |   |
   |   |   |-- en
   |   |   |   |
   |   |   |   |-- post1.html
   |   |   |   |-- post2.html
   |   |   |  
   |   |   |-- de
   |   |       |
   |   |       |-- post1.html
   |   |       |-- post2.html
   |   |
   |   |-- en
   |   |   |
   |   |   |-- signup.html
   |   |
   |   |-- de
   |       |
   |       |-- signup.html
   |
   |--en
   |  |
   |  |-- index.html
   |
   |--de
      |
      |-- index.html
```

#### Flat output format

```js
const mlingual = require('mlingual');

await mlingual({
  dict: {
    src: './src/dict'
  },
  template: {
    src: './src/html',
    dest: './public/html',
    isFlat: true
  }
});
```

This will produce the following output folder structure:

```
-- public/html
   |
   |-- pages.blog.post1.en.html
   |-- pages.blog.post1.de.html
   |-- pages.blog.post2.en.html
   |-- pages.blog.post2.de.html
   |-- pages.signup.en.html
   |-- pages.signup.de.html
   |-- index.en.html
   |-- index.de.html
```


## API Reference

`{Function} mlingual(dict, [template])`

Returns `{Promise<void>}`

### `{Object} dict`

Dictionary related options. Required.

Properties:

* `{String} src` - Absolute or relative to `process.cwd()` path to the folder containing dictionaries. Required.

* `{String} dest` - Absolute or relative to process.cwd() path to the destination folder for converted dictionaries. Optional. If not provided, converted dictionaries are not saved.

* `{Boolean} isFlat` - If true, converted dictionaries are flatly output to the `dest` folder in the format `[subfolder1].[subfolderN].[filename].[langCode].json` instead of preserving subfolder structure.  Optional. Defaults to `false`. This prop has no effect if `dest` prop is not provided.

* `{String} summaryDest` - Absolute or relative to process.cwd() path to the folder to save a json-file containing an array of generated dictionaries filenames. Optional. If not provided, the summary file is not created. This prop has no effect if `dest` prop is not provided.

* `{String} summaryFileName` - Name of the summary file without extension. File extension is always `.json`. Optional. Defaults to `dict-summary`.

### `{Object} template`

Template related options. Optional. If not provided, templates are not processed.

* `{String} src` - Absolute or relative to `process.cwd()` path to the folder containing source templates to be processed.

* `{String} dest` - Absolute or relative to process.cwd() path to the destination folder for processed templates.

* `{String} delimiter` - Placeholder delimiter symbol(s) for templates processing. Optional. Defaults to `$$`.

* `{Boolean} isFlat` - If true, output files are saved in the dest folder in relative subfolder in the format `[filename].[langCode].[ext]` instead of creating additional subfolders for each language code. Optional. Defaults to `false`.
