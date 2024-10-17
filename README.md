# jest-slate-model

## Introduction

This package provide a unit test utility for [Slate](https://docs.slatejs.org/).
You can test slate model with selection embbeded format.

Slate model is flexible but difficult to read especially it has a selection.
For example, select `world` in the `hello world!` is:

```javascript
const editor = {
  children: [{
    type: "paragraph",
    children: [{ text: "hello world!" }],
  }],
  selection: {
    anchor: { path: [0, 0], offset: 6 },
    focus: { path: [0, 0], offset: 11 }
  }
}

```

You can write the test of the same editor state as below:

```javascript
import { createEditor } from '@yosu/jest-slate-model';

test("Test", () => {
  const editor = createEditor([{
    type: "paragraph",
    children: [{ text: "hello <anchor>world<focus>!" }],
  }]);

  expect(editor.children).toEqual([{
    type: "paragraph",
    children: [{ text: "hello world!" }],
  }]);
  expect(editor.selection).toEqual({
    anchor: { path: [0, 0], offset: 6 },
    focus: { path: [0, 0], offset: 11 }
  });

  expect(editor).toMatchEditorState([{
    type: "paragraph",
    children: [{ text: "hello <anchor>world<focus>!" }],
  }])
});
```

If anchor and focus is the same position, use `<cursor>` instead.

## Install
This library is available as a package on NPM, install with your favorite package manager:

```dircolors
npm install --save-dev @yosu/jest-slate-model
```

## Quick start
Import `@yosu/jest-slate-model/matcher` once in your [tests setup file](https://jestjs.io/docs/en/configuration.html#setupfilesafterenv-array):

```javascript
// In your custom-matcher.js (or any other name)
import '@yosu/jest-slate-model/matcher';

// In jest.config.js add (if you haven't already)
setupFilesAfterEnv: ['<rootDir>/custom-matcher.js']
```

## Lisence

This project is licensed under the MIT License, see the LICENSE.txt file for details.
