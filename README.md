# Pyre
Pyre is a static site generator built on [Lit](https://lit.dev). It uses [@lit-labs/ssr](https://www.npmjs.com/package/@lit-labs/ssr) to render html pages from a render function and Lit-based web components.

Pyre is a work in progress and is not ready for production use. It is rapidly changing and may introduce breaking changes at any time.

## Quickstart
Until an `init` command is added, you can create a Pyre website by cloning [pyre-template](https://github.com/WillsonSmith/pyre-template) and running `npm install`.

## Building a Pyre website
Building a Pyre website is much like the classic way of building a website. You create some "html" (`*.pyre.ts`) files, add some assets, and then run `pyre build` to generate a static site.

### Getting started

Pyre websites have the following structure:
```
pyre.config.js
src/
  index.pyre.ts
  about.pyre.ts
  assets/
    style.css
```

A basic `.pyre.ts` file looks like this:
```ts
import { html } from 'lit';
export const render = () => {
  return html`<h1>Hello, world!</h1>`;
};
```
This will utilize an [HTML template](https://github.com/WillsonSmith/Pyre/blob/main/packages/pyre/htmlTemplates/_base.html) to generate HTML.

**Dependencies**
```bash
npm i lit @lit-labs/ssr-client @webcomponents/template-shadowroot
```

#### `pyre.config.js`
The `pyre.config.js` file is a module that exports a configuration function. The configuration object has the following properties:
```js
export default () => {
  return {
    input: 'src',
    output: { dir: 'pyre' },
    watch: { assetStrategy: 'symlink' },
    build: { assetStrategy: 'copy' },
    assetStrategy: 'symlink',
  };
};
```

**`input`**
The `input` property is the directory where your Pyre website's source files are located. The default value is `src`.

**`output`**
The `output` property is the an object with a `dir` property which determines where the built website will be saved.

**`watch`**
The `watch` property is an object that determines how Pyre will handle assets when running `pyre watch`. The `assetStrategy` property can be set to `symlink` or `copy`. The default value is `symlink`.

**`build`**
The `build` property is an object that determines how Pyre will handle assets when running `pyre build`. The `assetStrategy` property can be set to `symlink` or `copy`. The default value is `copy`.

**`assetStrategy`**
The `assetStrategy` property is a shortcut for setting both the `watch.assetStrategy` and `build.assetStrategy` properties. The default value is `symlink`. When the asset strategy is set to `symlink`, Pyre will create symlinks to assets in the `input` directory in the `output` directory. When the asset strategy is set to `copy`, Pyre will copy assets from the `input` directory to the `output` directory.


