import { createEditor } from "./editor";
import "./matcher";

test("toMatchEditorState()", () => {
  const initialValue = [{
    type: "paragraph",
    children: [{ text: "hello<cursor>" }],
  }];
  const editor = createEditor(initialValue);

  expect(editor).toMatchEditorState([{
    type: "paragraph",
    children: [{ text: "hello<cursor>" }],
  }])

  expect(editor).not.toMatchEditorState([{
    type: "paragraph",
    children: [{ text: "hello" }],
  }])
});
