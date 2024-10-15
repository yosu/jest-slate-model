import { createEditor } from "./editor";

describe("createEditor()", () => {
  test("empty value", () => {
    const initialValue = [];
    const editor = createEditor(initialValue);

    expect(editor.children).toEqual([]);
    expect(editor.selection).toEqual(null);
  });

  test("a paragraph", () => {
    const initialValue = [{ type: "paragraph", children:[{ text: "hello" }] }];
    const editor = createEditor(initialValue);

    expect(editor.children).toEqual(initialValue);
    expect(editor.selection).toEqual(null);
  });

  test("a selection", () => {
    const initialValue = [{
      type: "paragraph",
      children:[{ text: "hello<cursor>" }]
    }];
    const editor = createEditor(initialValue);

    expect(editor.children).toEqual([{
      type: "paragraph",
      children: [{ text: "hello" }]
    }]);
    expect(editor.selection).toEqual({
      anchor: { path: [0, 0], offset: 5 },
      focus: {  path: [0, 0], offset: 5 }
    });
  })
})

