import { createEditor as createEditorOrg } from "slate";
import { EmbModel } from "./emb_model";

export function createEditor(initialValue) {
  const decoded = EmbModel.decode(initialValue);

  const editor = createEditorOrg();

  // The code below is from "slate-react" <Slate> component.
  // https://github.com/ianstormtaylor/slate/blob/8c7f7ea6ac491d6e1325810ef11fc2b3455b1304/packages/slate-react/src/components/slate.tsx#L51
  editor.children = decoded.children;
  editor.selection = decoded.selection;

  return editor;
}



