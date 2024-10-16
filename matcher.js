import { EmbModel } from './emb_model';

expect.extend({
  toMatchEditorState(editor, expected) {
    const editorState = EmbModel.encode(editor)
    const pass = this.equals(editorState, expected);

    const message = () => {
      const hint = this.utils.matcherHint("toMatchEditorState", 'editor', 'expectedState', {
        isNot: this.isNot,
        promise: this.promise,
      });
      const diff = this.utils.printDiffOrStringify(
        expected,
        editorState,
        "Expected",
        "Received",
        this.expand
      );
      return hint + "\n\n" + diff;
    }

    return { pass, message };
  },
})
