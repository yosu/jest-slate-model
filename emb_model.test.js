import { EmbModel } from "./emb_model"
import { createEditor } from "slate";

describe("EmbModel.decode()", () => {
  test("Empty value", () => {
    const value = [];
    const editor = EmbModel.decode(value);

    expect(editor.children).toEqual([]);
    expect(editor.selection).toEqual(null);
  });

  test("A node with no selection", () => {
    const value = [{
      type: "paragraph",
      children: [{ text: "hello" }]
    }];
    const editor = EmbModel.decode(value);

    const expected = [{
      type: "paragraph",
      children: [{ text: "hello" }]
    }];
    expect(editor.children).toEqual(expected);
    expect(editor.selection).toEqual(null);

  });

  test("A node with cursor", () => {
    const value = [{
      type: "paragraph",
      children:[{ text: "hello<cursor>" }]
    }];
    const editor = EmbModel.decode(value);

    expect(editor.children).toEqual([{
      type: "paragraph",
      children: [{ text: "hello" }]
    }]);
    expect(editor.selection).toEqual({
      anchor: { path: [0, 0], offset: 5 },
      focus: {  path: [0, 0], offset: 5 }
    });

    // the argument must be unchanged
    expect(value).toEqual([{
      type: "paragraph",
      children:[{ text: "hello<cursor>" }]
    }]);
  });

  test("Nested node with cursor", () => {
    const value = [{
      type: "paragraph",
      children:[{
        type: "paragraph",
        children: [{
          type: "paragraph",
          children: [{ text: "hello<cursor>" }],
        }],
      }],
    }];
    const editor = EmbModel.decode(value);

    expect(editor.children).toEqual([{
      type: "paragraph",
      children:[{
        type: "paragraph",
        children: [{
          type: "paragraph",
          children: [{ text: "hello" }],
        }],
      }],
    }]);
    expect(editor.selection).toEqual({
      anchor: { path: [0, 0, 0, 0], offset: 5 },
      focus: {  path: [0, 0, 0, 0], offset: 5 }
    });

    // the argument must be unchanged
    expect(value).toEqual([{
      type: "paragraph",
      children:[{
        type: "paragraph",
        children: [{
          type: "paragraph",
          children: [{ text: "hello<cursor>" }],
        }],
      }],
    }]);
  });

  test("A node with anchor and focus", () => {
    const value = [{
      type: "paragraph",
      children:[{ text: "One<anchor>Two<focus>Three" }]
    }];
    const editor = EmbModel.decode(value);

    expect(editor.children).toEqual([{
      type: "paragraph",
      children: [{ text: "OneTwoThree" }]
    }]);
    expect(editor.selection).toEqual({
      anchor: { path: [0, 0], offset: 3 },
      focus: {  path: [0, 0], offset: 6 }
    });
  });

  test("A node with anchor and focus (reverse order)", () => {
    const value = [{
      type: "paragraph",
      children:[{ text: "One<focus>Two<anchor>Three" }]
    }];
    const editor = EmbModel.decode(value);

    expect(editor.children).toEqual([{
      type: "paragraph",
      children: [{ text: "OneTwoThree" }]
    }]);
    expect(editor.selection).toEqual({
      anchor: { path: [0, 0], offset: 6 },
      focus: {  path: [0, 0], offset: 3 }
    });
  });

  test("A selection over multiple nodes", () => {
    const value = [
      {
        type: "paragraph",
        children:[{ text: "<anchor>One" }]
      },
      {
        type: "paragraph",
        children:[{ text: "Two" }]
      },
      {
        type: "paragraph",
        children:[{ text: "Three<focus>" }]
      },
    ];
    const editor = EmbModel.decode(value);

    expect(editor.children).toEqual([
      {
        type: "paragraph",
        children:[{ text: "One" }]
      },
      {
        type: "paragraph",
        children:[{ text: "Two" }]
      },
      {
        type: "paragraph",
        children:[{ text: "Three" }]
      },
    ]);
    expect(editor.selection).toEqual({
      anchor: { path: [0, 0], offset: 0 },
      focus: {  path: [2, 0], offset: 5 }
    });
  });
});

describe("EmbModel.encode()", () => {
  test("No cursor", () => {
    const editor = createEditor();
    editor.children = [{
      type: "paragraph",
      children: [{ text: "hello" }],
    }];
    editor.selection = null;

    expect(EmbModel.encode(editor)).toEqual([{
        type: "paragraph",
        children: [{ text: "hello" }],
      }])
  });

  test("A cursor in a node", () => {
    const editor = createEditor();
    editor.children = [{
      type: "paragraph",
      children: [{ text: "hello" }],
    }];
    editor.selection = {
      anchor: { path: [0, 0], offset: 5 },
      focus: { path: [0, 0], offset: 5 },
    };

    expect(EmbModel.encode(editor)).toEqual([{
      type: "paragraph",
      children: [{ text: "hello<cursor>" }],
    }])

    // editor state must be unchanged
    expect(editor.children).toEqual([{
      type: "paragraph",
      children: [{ text: "hello" }],
    }])
    expect(editor.selection).toEqual({
      anchor: { path: [0, 0], offset: 5 },
      focus: { path: [0, 0], offset: 5 },
    })
  });

  test("Anchor and Focus in a node", () => {
    const editor = createEditor();
    editor.children = [{
      type: "paragraph",
      children: [{ text: "hello" }],
    }];
    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 5 },
    };

    expect(EmbModel.encode(editor)).toEqual([{
      type: "paragraph",
      children: [{ text: "<anchor>hello<focus>" }],
    }])
  });

  test("Anchor and Focus in a node (reverse order)", () => {
    const editor = createEditor();
    editor.children = [{
      type: "paragraph",
      children: [{ text: "hello" }],
    }];
    editor.selection = {
      anchor: { path: [0, 0], offset: 5 },
      focus: { path: [0, 0], offset: 0 },
    };

    expect(EmbModel.encode(editor)).toEqual([{
      type: "paragraph",
      children: [{ text: "<focus>hello<anchor>" }],
    }])

  });

  test("Anchor and Focus over multiple nodes", () => {
    const editor = createEditor();
    editor.children = [{
      type: "paragraph",
      children: [{ text: "One" }],
    }, {
      type: "paragraph",
      children: [{ text: "Two" }],
    }, {
      type: "paragraph",
      children: [{ text: "Three" }],
    }];
    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [2, 0], offset: 5 },
    };

    expect(EmbModel.encode(editor)).toEqual([{
      type: "paragraph",
      children: [{ text: "<anchor>One" }],
    }, {
      type: "paragraph",
      children: [{ text: "Two" }],
    }, {
      type: "paragraph",
      children: [{ text: "Three<focus>" }],
    }])
  });
})
