import { createEditor } from ".";

test("createEditor()", () => {
  const editor = createEditor([]);

  expect(editor.children).toEqual([]);
});
